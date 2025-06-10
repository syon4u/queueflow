
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  location_id: string;
  staff_id: string | null;
  status: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  reason_for_visit: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  service?: Service;
  location?: Location;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  location_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  queue_status: string;
  max_capacity: number;
  current_capacity: number;
  capacity_buffer: number;
  operating_hours: any;
  created_at: string;
  updated_at: string;
}

export interface AppData {
  customers: Customer[];
  appointments: Appointment[];
  locations: Location[];
  services: Service[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useAppData = (): AppData => {
  // Fetch locations - now public
  const {
    data: locations = [],
    isLoading: locationsLoading,
    error: locationsError,
    refetch: refetchLocations
  } = useQuery({
    queryKey: ['app-locations'],
    queryFn: async () => {
      console.log('Fetching locations for app data...');
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
      
      console.log('App data locations loaded:', data?.length || 0);
      return data as Location[];
    },
    refetchInterval: 60000, // Less frequent updates for locations
  });

  // Fetch services - now public
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices
  } = useQuery({
    queryKey: ['app-services'],
    queryFn: async () => {
      console.log('Fetching services for app data...');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      console.log('App data services loaded:', data?.length || 0);
      return data as Service[];
    },
    refetchInterval: 60000,
  });

  // Note: Customers and appointments are commented out since they require authentication
  // and the customer portal should work without authentication
  const customers: Customer[] = [];
  const appointments: Appointment[] = [];
  const customersLoading = false;
  const appointmentsLoading = false;
  const customersError = null;
  const appointmentsError = null;

  const isLoading = locationsLoading || servicesLoading;
  const error = locationsError || servicesError;

  const refetch = () => {
    refetchLocations();
    refetchServices();
  };

  return {
    customers,
    appointments,
    locations,
    services,
    isLoading,
    error: error as Error | null,
    refetch
  };
};
