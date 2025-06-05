
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Calendar, Phone, Mail, History, FileText, MapPin, Settings, Filter, Users } from 'lucide-react';
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
  locations: string[];
  services: string[];
}

export const CustomerSearchTab: React.FC = () => {
  const { appointments, locations, services, isLoading } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // Extract unique customers from appointments data with location and service info
  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    appointments.forEach(appointment => {
      if (appointment.customer) {
        const customerId = appointment.customer_id;
        const existing = customerMap.get(customerId);

        const locationName = appointment.location?.name || 'Unknown Location';
        const serviceName = appointment.service?.name || 'Unknown Service';

        if (existing) {
          // Update existing customer with latest info
          existing.appointmentCount += 1;
          const appointmentDate = new Date(appointment.scheduled_time);
          const existingDate = existing.lastAppointment ? new Date(existing.lastAppointment) : null;
          
          if (!existingDate || appointmentDate > existingDate) {
            existing.lastAppointment = appointment.scheduled_time;
            existing.mostRecentStatus = appointment.status;
          }

          // Add unique locations and services
          if (!existing.locations.includes(locationName)) {
            existing.locations.push(locationName);
          }
          if (!existing.services.includes(serviceName)) {
            existing.services.push(serviceName);
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
            mostRecentStatus: appointment.status,
            locations: [locationName],
            services: [serviceName]
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

  // Filter customers based on search term, location, and service
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.first_name.toLowerCase().includes(search) ||
        customer.last_name.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.phone?.includes(search)
      );
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(customer =>
        customer.locations.includes(selectedLocation)
      );
    }

    // Filter by service
    if (selectedService !== 'all') {
      filtered = filtered.filter(customer =>
        customer.services.includes(selectedService)
      );
    }

    return filtered;
  }, [customers, searchTerm, selectedLocation, selectedService]);

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
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        <Card className="shadow-sm border-0 bg-white rounded-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <Card className="shadow-sm border-0 bg-white rounded-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Customer Management
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Search and manage customer records from appointment history
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {customers.length} Total Customers
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="shadow-sm border-0 bg-white rounded-xl">
        <CardHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">Search & Filter</span>
          </div>
          
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by Location</span>
                </div>
                <Tabs value={selectedLocation} onValueChange={setSelectedLocation} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-9">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    {locations.slice(0, 3).map((location) => (
                      <TabsTrigger
                        key={location.id}
                        value={location.name}
                        className="text-xs"
                      >
                        {location.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Service Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by Service</span>
                </div>
                <Tabs value={selectedService} onValueChange={setSelectedService} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-9">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    {services.slice(0, 3).map((service) => (
                      <TabsTrigger
                        key={service.id}
                        value={service.name}
                        className="text-xs"
                      >
                        {service.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-muted-foreground">
                Showing {filteredCustomers.length} of {customers.length} customers
              </span>
              {(selectedLocation !== 'all' || selectedService !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedLocation('all');
                    setSelectedService('all');
                  }}
                  className="h-8"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Customer Results */}
      <Card className="shadow-sm border-0 bg-white rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Customer Records ({filteredCustomers.length})
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Customer information extracted from appointment history
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="text-center p-12 bg-gray-50">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || selectedLocation !== 'all' || selectedService !== 'all' 
                    ? 'No customers found' 
                    : 'No customers available'
                  }
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedLocation !== 'all' || selectedService !== 'all'
                    ? 'Try adjusting your search terms or filters'
                    : 'Customers will appear here once they create appointments'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCustomers.map((customer, index) => (
                <div key={customer.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="space-y-3 flex-1 min-w-0">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </h3>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-1">
                            {customer.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{customer.email}</span>
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
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{customer.appointmentCount}</span>
                            <span className="text-muted-foreground">
                              appointment{customer.appointmentCount !== 1 ? 's' : ''}
                            </span>
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

                        {/* Location and Service Tags */}
                        <div className="flex flex-wrap gap-2">
                          {customer.locations.map((location, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              <MapPin className="h-3 w-3 mr-1" />
                              {location}
                            </Badge>
                          ))}
                          {customer.services.map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <Settings className="h-3 w-3 mr-1" />
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistory(customer.id)}
                        className="h-9"
                      >
                        <History className="h-4 w-4 mr-2" />
                        View History
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
