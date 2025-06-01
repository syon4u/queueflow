
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, MessageSquare } from 'lucide-react';
import { Customer } from '@/components/customer/CustomerSearchBox';

interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface HistoryTabProps {
  customer: Customer;
  refreshTrigger: number;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  customer,
  refreshTrigger
}) => {
  const { toast } = useToast();
  const [history, setHistory] = useState<CommunicationHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    fetchCommunicationHistory();
  }, [customer.id, refreshTrigger]);

  const fetchCommunicationHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch staff details for each communication
      const historyWithStaff: CommunicationHistory[] = [];
      for (const comm of data || []) {
        let staff = null;
        if (comm.staff_id) {
          const { data: staffData } = await supabase
            .from('staff')
            .select('first_name, last_name')
            .eq('id', comm.staff_id)
            .single();
          staff = staffData;
        }
        historyWithStaff.push({ 
          ...comm, 
          type: comm.type as 'email' | 'sms',
          staff 
        });
      }

      setHistory(historyWithStaff);
    } catch (error) {
      console.error('Error fetching communication history:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load communication history'
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoadingHistory) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading communication history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No communication history found</p>
        <p className="text-sm">Send your first message to this customer</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((comm) => (
        <Card key={comm.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {comm.type === 'email' ? (
                <Mail className="h-4 w-4 text-blue-500" />
              ) : (
                <MessageSquare className="h-4 w-4 text-green-500" />
              )}
              <Badge variant={comm.status === 'sent' ? 'default' : 'secondary'}>
                {comm.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(comm.created_at)}
              </span>
            </div>
            {comm.staff && (
              <span className="text-sm text-muted-foreground">
                by {comm.staff.first_name} {comm.staff.last_name}
              </span>
            )}
          </div>
          {comm.subject && (
            <div className="font-medium text-sm mb-1">
              Subject: {comm.subject}
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            {comm.message}
          </div>
        </Card>
      ))}
    </div>
  );
};
