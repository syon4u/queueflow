
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, BarChart3, MessageSquare } from 'lucide-react';
import { EnhancedCommunicationFilters } from './communication/EnhancedCommunicationFilters';
import { CommunicationList } from './communication/CommunicationList';
import { CommunicationAnalytics } from './communication/CommunicationAnalytics';
import { RetryFailedMessages } from './communication/RetryFailedMessages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  template_used?: string;
  customer_id: string;
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
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  useEffect(() => {
    fetchCommunications();
  }, [customerId]);

  const fetchCommunications = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching communications for customer:', customerId);
      
      const { data, error } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching communications:', error);
        throw error;
      }

      console.log('Fetched communications:', data);

      // Fetch staff details for each communication using profiles table
      const communicationsWithStaff: CommunicationHistory[] = [];
      for (const comm of data || []) {
        let staff = null;
        if (comm.staff_id) {
          const { data: staffData } = await supabase
            .from('profiles')
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setStaffFilter('all');
    setDateRange({});
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (comm.subject && comm.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || comm.status === statusFilter;
    const matchesStaff = staffFilter === 'all' || 
                        (comm.staff && `${comm.staff.first_name} ${comm.staff.last_name}` === staffFilter);
    
    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const commDate = new Date(comm.created_at);
      if (dateRange.from) {
        matchesDate = matchesDate && commDate >= dateRange.from;
      }
      if (dateRange.to) {
        matchesDate = matchesDate && commDate <= dateRange.to;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesStaff && matchesDate;
  });

  const failedCommunications = communications.filter(comm => comm.status === 'failed');

  // Calculate summary stats
  const totalCommunications = communications.length;
  const emailCount = communications.filter(comm => comm.type === 'email').length;
  const smsCount = communications.filter(comm => comm.type === 'sms').length;
  const failedCount = failedCommunications.length;

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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalCommunications}
            </div>
            <div className="text-sm text-muted-foreground">Total Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {emailCount}
            </div>
            <div className="text-sm text-muted-foreground">Emails Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {smsCount}
            </div>
            <div className="text-sm text-muted-foreground">SMS Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {failedCount}
            </div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <EnhancedCommunicationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        staffFilter={staffFilter}
        onStaffFilterChange={setStaffFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Retry Failed Messages */}
      {failedCommunications.length > 0 && (
        <RetryFailedMessages
          failedMessages={failedCommunications}
          onRetryComplete={fetchCommunications}
        />
      )}

      {/* Tabs for List and Analytics */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Communications
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4 mt-6">
          <CommunicationList
            communications={filteredCommunications}
            isLoading={isLoading}
            searchTerm={searchTerm}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <CommunicationAnalytics
            communications={filteredCommunications}
            dateRange={dateRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
