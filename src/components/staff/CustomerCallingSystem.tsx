
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Phone, PhoneCall, UserX, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface QueueCustomer {
  id: string;
  name: string;
  phone?: string;
  service: string;
  waitTime: number;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'called' | 'no_show';
}

interface CustomerCallingSystemProps {
  customers: QueueCustomer[];
  onCustomerCalled: (customerId: string) => void;
  onNoShow: (customerId: string) => void;
}

export const CustomerCallingSystem: React.FC<CustomerCallingSystemProps> = ({
  customers,
  onCustomerCalled,
  onNoShow
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [callingCustomer, setCallingCustomer] = useState<string | null>(null);

  const callCustomer = async (customer: QueueCustomer) => {
    setCallingCustomer(customer.id);
    
    try {
      // Update customer status to 'called'
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'called' })
        .eq('customer_id', customer.id);

      if (error) throw error;

      // Show display board notification
      toast({
        title: t('queue.customerCalled'),
        description: `${customer.name} - ${customer.service}`,
        duration: 5000,
      });

      onCustomerCalled(customer.id);
    } catch (error) {
      console.error('Error calling customer:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.callError'),
      });
    } finally {
      setCallingCustomer(null);
    }
  };

  const markNoShow = async (customer: QueueCustomer) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'no_show' })
        .eq('customer_id', customer.id);

      if (error) throw error;

      toast({
        title: t('queue.markedNoShow'),
        description: customer.name,
      });

      onNoShow(customer.id);
    } catch (error) {
      console.error('Error marking no-show:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.noShowError'),
      });
    }
  };

  const formatWaitTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5" />
          {t('queue.customerCalling')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('queue.noCustomersWaiting')}</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{customer.name}</span>
                    {customer.priority === 'priority' && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {t('queue.priority')}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {customer.service}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatWaitTime(customer.waitTime)}
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => callCustomer(customer)}
                    disabled={callingCustomer === customer.id || customer.status === 'called'}
                  >
                    <PhoneCall className="h-4 w-4 mr-1" />
                    {customer.status === 'called' ? t('queue.called') : t('queue.callNext')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => markNoShow(customer)}
                    disabled={callingCustomer === customer.id}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
