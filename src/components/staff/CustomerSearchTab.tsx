
import React, { useState, useMemo } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { CustomerHistoryDialog } from './CustomerHistoryDialog';
import { CustomerSearchHeader } from './customer-search/CustomerSearchHeader';
import { CustomerSearchFilters } from './customer-search/CustomerSearchFilters';
import { CustomerTable } from './customer-search/CustomerTable';
import { CustomerStatsCards } from './customer-search/CustomerStatsCards';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  confirmation_number?: string;
  appointmentCount: number;
  lastAppointment: string | null;
  mostRecentStatus: string;
  locations: string[];
  services: string[];
}

export const CustomerSearchTab: React.FC = () => {
  const { appointments, locations, services, isLoading: appointmentsLoading } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // Fetch customers with confirmation numbers
  const { data: customersData = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers-with-confirmation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, first_name, last_name, email, phone, confirmation_number')
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 30000
  });

  // Extract unique customers from appointments data with location and service info
  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    // Initialize customers from the customers table
    customersData.forEach(customer => {
      customerMap.set(customer.id, {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        confirmation_number: customer.confirmation_number,
        appointmentCount: 0,
        lastAppointment: null,
        mostRecentStatus: 'none',
        locations: [],
        services: []
      });
    });

    // Add appointment data to existing customers
    appointments.forEach(appointment => {
      if (appointment.customer) {
        const customerId = appointment.customer_id;
        const existing = customerMap.get(customerId);

        const locationName = appointment.location?.name || 'Unknown Location';
        const serviceName = appointment.service?.name || 'Unknown Service';

        if (existing) {
          // Update existing customer with appointment info
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
          // Create new customer entry if not found in customers table
          customerMap.set(customerId, {
            id: customerId,
            first_name: appointment.customer.first_name,
            last_name: appointment.customer.last_name,
            email: appointment.customer.email,
            phone: appointment.customer.phone,
            confirmation_number: undefined, // Will be null for customers not in the main table
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
  }, [appointments, customersData]);

  // Filter customers based on search term, location, and service
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Filter by search term (including confirmation number)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.first_name.toLowerCase().includes(search) ||
        customer.last_name.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.phone?.includes(search) ||
        customer.confirmation_number?.toLowerCase().includes(search)
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

  const handleViewHistory = (customerId: string) => {
    setSelectedCustomer(customerId);
    setHistoryDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedLocation('all');
    setSelectedService('all');
  };

  const selectedCustomerData = selectedCustomer ? 
    customers.find(c => c.id === selectedCustomer) : null;

  const isLoading = appointmentsLoading || customersLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CustomerSearchHeader totalCustomers={0} />
        <div className="flex justify-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CustomerSearchHeader totalCustomers={customers.length} />
      
      <CustomerStatsCards 
        customers={customers}
        filteredCustomers={filteredCustomers}
      />
      
      <CustomerSearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedService={selectedService}
        onServiceChange={setSelectedService}
        locations={locations}
        services={services}
        totalCustomers={customers.length}
        filteredCount={filteredCustomers.length}
        onClearFilters={handleClearFilters}
      />

      <CustomerTable
        customers={filteredCustomers}
        onViewHistory={handleViewHistory}
      />

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
