
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, Calendar, Phone, Mail, History, FileText } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { CustomerHistoryDialog } from './CustomerHistoryDialog';
import { format } from 'date-fns';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  appointmentCount: number;
  lastAppointment: string | null;
  mostRecentStatus: string;
}

export const CustomerSearchTab: React.FC = () => {
  const { appointments, isLoading } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // Extract unique customers from appointments data
  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    appointments.forEach(appointment => {
      if (appointment.customer) {
        const customerId = appointment.customer_id;
        const existing = customerMap.get(customerId);

        if (existing) {
          // Update existing customer with latest info
          existing.appointmentCount += 1;
          const appointmentDate = new Date(appointment.scheduled_time);
          const existingDate = existing.lastAppointment ? new Date(existing.lastAppointment) : null;
          
          if (!existingDate || appointmentDate > existingDate) {
            existing.lastAppointment = appointment.scheduled_time;
            existing.mostRecentStatus = appointment.status;
          }
        } else {
          // Create new customer entry
          customerMap.set(customerId, {
            id: customerId,
            first_name: appointment.customer.first_name,
            last_name: appointment.customer.last_name,
            email: appointment.customer.email,
            phone: appointment.customer.phone,
            appointmentCount: 1,
            lastAppointment: appointment.scheduled_time,
            mostRecentStatus: appointment.status
          });
        }
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => {
      const aDate = a.lastAppointment ? new Date(a.lastAppointment) : new Date(0);
      const bDate = b.lastAppointment ? new Date(b.lastAppointment) : new Date(0);
      return bDate.getTime() - aDate.getTime();
    });
  }, [appointments]);

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;

    const search = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.first_name.toLowerCase().includes(search) ||
      customer.last_name.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.includes(search)
    );
  }, [customers, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked_in':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewHistory = (customerId: string) => {
    setSelectedCustomer(customerId);
    setHistoryDialogOpen(true);
  };

  const selectedCustomerData = selectedCustomer ? 
    customers.find(c => c.id === selectedCustomer) : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Customer Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Customer Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              Found {filteredCustomers.length} customers from appointment records
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Results */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No customers found' : 'No customers available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Customers will appear here once they create appointments'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {customer.first_name} {customer.last_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {customer.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{customer.appointmentCount}</span>
                          <span className="text-muted-foreground">appointments</span>
                        </div>
                        
                        {customer.lastAppointment && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Last visit:</span>
                            <span className="font-medium">
                              {format(new Date(customer.lastAppointment), 'MMM d, yyyy')}
                            </span>
                            <Badge className={getStatusColor(customer.mostRecentStatus)}>
                              {customer.mostRecentStatus.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewHistory(customer.id)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Customer History Dialog */}
      {selectedCustomer && selectedCustomerData && (
        <CustomerHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          customerId={selectedCustomer}
          customerName={`${selectedCustomerData.first_name} ${selectedCustomerData.last_name}`}
        />
      )}
    </div>
  );
};
