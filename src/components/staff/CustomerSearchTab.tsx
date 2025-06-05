
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, User, Calendar, Phone, Mail, History, MapPin, Settings, Filter, Users } from 'lucide-react';
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
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
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
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <Card>
        <CardHeader>
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
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              {customers.length} Total Customers
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
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
                className="pl-10"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Location
                </label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-md z-50">
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Service
                </label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-md z-50">
                    <SelectItem value="all">All Services</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.name}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-transparent">Clear</label>
                {(selectedLocation !== 'all' || selectedService !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLocation('all');
                      setSelectedService('all');
                    }}
                    className="w-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="text-sm text-muted-foreground pt-2 border-t">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Records ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="text-center p-12">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {customer.email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{customer.email}</span>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{customer.appointmentCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.lastAppointment ? (
                        <span className="text-sm">
                          {format(new Date(customer.lastAppointment), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.mostRecentStatus)}>
                        {customer.mostRecentStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {customer.locations.slice(0, 2).map((location, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {location}
                          </Badge>
                        ))}
                        {customer.locations.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{customer.locations.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {customer.services.slice(0, 2).map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {service}
                          </Badge>
                        ))}
                        {customer.services.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{customer.services.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistory(customer.id)}
                      >
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
