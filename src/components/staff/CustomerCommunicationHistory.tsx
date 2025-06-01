
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw } from 'lucide-react';
import { CommunicationFilters } from './communication/CommunicationFilters';
import { CommunicationList } from './communication/CommunicationList';
import { CommunicationStatistics } from './communication/CommunicationStatistics';

interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  template_used?: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface CustomerCommunicationHistoryProps {
  customerId: string;
  customerName: string;
}

export const CustomerCommunicationHistory: React.FC<CustomerCommunicationHistoryProps> = ({
  customerId,
  customerName
}) => {
  const { toast } = useToast();
  const [communications, setCommunications] = useState<CommunicationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchCommunications();
  }, [customerId]);

  const fetchCommunications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch staff details for each communication
      const communicationsWithStaff: CommunicationHistory[] = [];
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
        communicationsWithStaff.push({ 
          ...comm, 
          type: comm.type as 'email' | 'sms',
          staff 
        });
      }

      setCommunications(communicationsWithStaff);
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load communication history'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (comm.subject && comm.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || comm.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Communication History</h3>
          <p className="text-sm text-muted-foreground">{customerName}</p>
        </div>
        <Button
          onClick={fetchCommunications}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <CommunicationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Communications List */}
      <CommunicationList
        communications={filteredCommunications}
        isLoading={isLoading}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
      />

      {/* Statistics */}
      <CommunicationStatistics communications={communications} />
    </div>
  );
};
