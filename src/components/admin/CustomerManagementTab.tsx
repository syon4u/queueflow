
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomerStatsCards } from './customer/CustomerStatsCards';
import { CustomerSearchBox } from './customer/CustomerSearchBox';
import { CustomerTable } from './customer/CustomerTable';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  appointment_count?: number;
  last_appointment?: string;
  most_used_location?: string;
  most_used_service?: string;
}

const CustomerManagementTab = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('CustomerManagementTab - Starting to fetch customers...');
      
      // First, get all customers with a simpler approach
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) {
        console.error('Error fetching customers:', customersError);
        toast({
          title: 'Error',
          description: 'Failed to load customers: ' + customersError.message,
          variant: 'destructive',
        });
        setCustomers([]);
        return;
      }

      console.log('CustomerManagementTab - Raw customers data:', customersData);

      if (!customersData || customersData.length === 0) {
        console.log('CustomerManagementTab - No customers found');
        setCustomers([]);
        return;
      }

      // Use a more efficient approach with a single query for appointment counts
      try {
        const { data: appointmentCounts, error: countError } = await supabase
          .from('appointments')
          .select('customer_id')
          .in('customer_id', customersData.map(c => c.id));

        if (countError) {
          console.error('Error fetching appointment counts:', countError);
        }

        // Process appointment counts
        const appointmentCountMap = (appointmentCounts || []).reduce((acc: Record<string, number>, apt) => {
          acc[apt.customer_id] = (acc[apt.customer_id] || 0) + 1;
          return acc;
        }, {});

        // Get last appointment dates with a single query
        const { data: lastAppointments, error: lastError } = await supabase
          .from('appointments')
          .select('customer_id, scheduled_time')
          .in('customer_id', customersData.map(c => c.id))
          .order('scheduled_time', { ascending: false });

        if (lastError) {
          console.error('Error fetching last appointments:', lastError);
        }

        // Process last appointments
        const lastAppointmentMap = (lastAppointments || []).reduce((acc: Record<string, string>, apt) => {
          if (!acc[apt.customer_id]) {
            acc[apt.customer_id] = apt.scheduled_time;
          }
          return acc;
        }, {});

        // Get location and service preferences with joins
        const { data: appointmentDetails, error: detailsError } = await supabase
          .from('appointments')
          .select(`
            customer_id,
            locations!inner(name),
            services!inner(name)
          `)
          .in('customer_id', customersData.map(c => c.id));

        if (detailsError) {
          console.error('Error fetching appointment details:', detailsError);
        }

        // Process location and service preferences
        const locationMap: Record<string, Record<string, number>> = {};
        const serviceMap: Record<string, Record<string, number>> = {};

        (appointmentDetails || []).forEach((apt: any) => {
          const customerId = apt.customer_id;
          const locationName = apt.locations?.name;
          const serviceName = apt.services?.name;

          if (locationName) {
            if (!locationMap[customerId]) locationMap[customerId] = {};
            locationMap[customerId][locationName] = (locationMap[customerId][locationName] || 0) + 1;
          }

          if (serviceName) {
            if (!serviceMap[customerId]) serviceMap[customerId] = {};
            serviceMap[customerId][serviceName] = (serviceMap[customerId][serviceName] || 0) + 1;
          }
        });

        // Combine all data
        const enhancedCustomers = customersData.map((customer) => {
          const customerId = customer.id;
          
          // Find most used location
          const customerLocations = locationMap[customerId];
          let mostUsedLocation = null;
          if (customerLocations) {
            mostUsedLocation = Object.keys(customerLocations).reduce((a, b) => 
              customerLocations[a] > customerLocations[b] ? a : b
            );
          }

          // Find most used service
          const customerServices = serviceMap[customerId];
          let mostUsedService = null;
          if (customerServices) {
            mostUsedService = Object.keys(customerServices).reduce((a, b) => 
              customerServices[a] > customerServices[b] ? a : b
            );
          }

          return {
            ...customer,
            appointment_count: appointmentCountMap[customerId] || 0,
            last_appointment: lastAppointmentMap[customerId] || null,
            most_used_location: mostUsedLocation,
            most_used_service: mostUsedService,
          };
        });

        console.log('CustomerManagementTab - Enhanced customers data:', enhancedCustomers);
        setCustomers(enhancedCustomers);
      } catch (enhancementError) {
        console.error('Error enhancing customer data:', enhancementError);
        // Fall back to basic customer data if enhancement fails
        const basicCustomers = customersData.map(customer => ({
          ...customer,
          appointment_count: 0,
          last_appointment: null,
          most_used_location: null,
          most_used_service: null,
        }));
        setCustomers(basicCustomers);
        toast({
          title: 'Warning',
          description: 'Customer data loaded with limited information due to processing error',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setCustomers([]);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('CustomerManagementTab - Component mounted, fetching customers');
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchLower) ||
      customer.last_name.toLowerCase().includes(searchLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phone && customer.phone.includes(searchTerm)) ||
      (customer.most_used_location && customer.most_used_location.toLowerCase().includes(searchLower)) ||
      (customer.most_used_service && customer.most_used_service.toLowerCase().includes(searchLower))
    );
  });

  console.log('CustomerManagementTab - Current state:', {
    loading,
    customersCount: customers.length,
    filteredCount: filteredCustomers.length,
    searchTerm
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading customers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-muted-foreground">
            View and manage customers with comprehensive appointment history and preferences
          </p>
        </div>
        <Button onClick={fetchCustomers} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomerSearchBox
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <CustomerStatsCards customers={customers} />
      </div>

      {/* Customer List */}
      <CustomerTable
        customers={customers}
        filteredCustomers={filteredCustomers}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default CustomerManagementTab;
