
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Monitor, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DisplayCustomer {
  id: string;
  name: string;
  service: string;
  status: 'now_serving' | 'called' | 'waiting';
  position?: number;
}

export const QueueDisplayBoard: React.FC = () => {
  const { t } = useTranslation();
  const [currentCustomer, setCurrentCustomer] = useState<DisplayCustomer | null>(null);
  const [calledCustomers, setCalledCustomers] = useState<DisplayCustomer[]>([]);
  const [waitingCount, setWaitingCount] = useState(0);

  useEffect(() => {
    // Subscribe to real-time queue updates
    const channel = supabase
      .channel('queue-display')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Queue update:', payload);
          // Update display based on status changes
          fetchQueueData();
        }
      )
      .subscribe();

    fetchQueueData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQueueData = async () => {
    try {
      // This would be replaced with actual queue data fetching
      // For now, using mock data to demonstrate the interface
      setCurrentCustomer({
        id: '1',
        name: 'John Doe',
        service: 'Document Review',
        status: 'now_serving'
      });

      setCalledCustomers([
        {
          id: '2',
          name: 'Jane Smith',
          service: 'Application Process',
          status: 'called'
        }
      ]);

      setWaitingCount(5);
    } catch (error) {
      console.error('Error fetching queue data:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Monitor className="h-5 w-5" />
            {t('queue.nowServing')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentCustomer ? (
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-green-800 mb-2">
                {currentCustomer.name}
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {currentCustomer.service}
              </Badge>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('queue.noOneBeingServed')}
            </div>
          )}
        </CardContent>
      </Card>

      {calledCustomers.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="h-5 w-5" />
              {t('queue.recentlyCalled')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {calledCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{customer.name}</span>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    {customer.service}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('queue.waitingCustomers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-primary mb-2">
              {waitingCount}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('queue.customersInQueue')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
