
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, MessageSquare, Search, Filter, Send, RefreshCw } from 'lucide-react';

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
        communicationsWithStaff.push({ ...comm, staff });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default';
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

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
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Communications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading communications...</p>
          </div>
        ) : filteredCommunications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No communications found</p>
            <p className="text-sm">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'No messages have been sent to this customer yet'
              }
            </p>
          </div>
        ) : (
          filteredCommunications.map((comm) => (
            <Card key={comm.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {comm.type === 'email' ? (
                    <Mail className="h-5 w-5 text-blue-500" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-green-500" />
                  )}
                  <Badge variant={getStatusColor(comm.status)}>
                    {comm.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(comm.created_at)}
                  </span>
                </div>
                
                <div className="text-right text-sm text-muted-foreground">
                  {comm.staff && (
                    <div>by {comm.staff.first_name} {comm.staff.last_name}</div>
                  )}
                  {comm.template_used && (
                    <div className="text-xs">Template: {comm.template_used}</div>
                  )}
                </div>
              </div>

              {comm.subject && (
                <div className="font-medium text-sm mb-2 text-blue-900">
                  Subject: {comm.subject}
                </div>
              )}

              <div className="text-sm bg-muted/50 p-3 rounded-md">
                {comm.message}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Statistics */}
      {communications.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{communications.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {communications.filter(c => c.type === 'email').length}
              </div>
              <div className="text-sm text-muted-foreground">Emails</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {communications.filter(c => c.type === 'sms').length}
              </div>
              <div className="text-sm text-muted-foreground">SMS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {communications.filter(c => c.status === 'failed').length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
