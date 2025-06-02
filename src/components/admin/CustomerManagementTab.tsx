
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
}

const CustomerManagementTab = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('CustomerManagementTab - Fetching customers...');
      
      // Fetch customers first
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
        return;
      }

      console.log('CustomerManagementTab - Customers data:', customersData);

      if (!customersData || customersData.length === 0) {
        console.log('CustomerManagementTab - No customers found');
        setCustomers([]);
        return;
      }

      // Get appointment counts for each customer
      const customersWithStats = await Promise.all(
        customersData.map(async (customer) => {
          try {
            // Get appointment count
            const { count: appointmentCount, error: countError } = await supabase
              .from('appointments')
              .select('*', { count: 'exact', head: true })
              .eq('customer_id', customer.id);

            if (countError) {
              console.error('Error fetching appointment count for customer:', customer.id, countError);
            }

            // Get last appointment date
            const { data: lastAppointment, error: lastError } = await supabase
              .from('appointments')
              .select('scheduled_time')
              .eq('customer_id', customer.id)
              .order('scheduled_time', { ascending: false })
              .limit(1);

            if (lastError) {
              console.error('Error fetching last appointment for customer:', customer.id, lastError);
            }

            return {
              ...customer,
              appointment_count: appointmentCount || 0,
              last_appointment: lastAppointment && lastAppointment.length > 0 ? lastAppointment[0].scheduled_time : null,
            };
          } catch (error) {
            console.error('Error processing customer stats:', error);
            return {
              ...customer,
              appointment_count: 0,
              last_appointment: null,
            };
          }
        })
      );

      console.log('CustomerManagementTab - Customers with stats:', customersWithStats);
      setCustomers(customersWithStats);
    } catch (error) {
      console.error('Unexpected error:', error);
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
      (customer.phone && customer.phone.includes(searchTerm))
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
            View and manage customers who have created appointments
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
