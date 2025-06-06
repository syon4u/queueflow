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
  // Relations
  customer?: Customer;
  service?: Service;
  location?: Location;
  staff?: {
    first_name: string;
    last_name: string;
  };
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
  // Fetch customers
  const {
    data: customers = [],
    isLoading: customersLoading,
    error: customersError,
    refetch: refetchCustomers
  } = useQuery({
    queryKey: ['app-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Customer[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds for live data
  });

  // Fetch appointments with relations
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['app-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers!appointments_customer_id_fkey (*),
          services!appointments_service_id_fkey (*),
          locations!appointments_location_id_fkey (*),
          profiles!appointments_staff_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(appointment => ({
        ...appointment,
        customer: appointment.customers,
        service: appointment.services,
        location: appointment.locations,
        staff: appointment.profiles
      })) as Appointment[];
    },
    refetchInterval: 15000, // More frequent updates for appointments
  });

  // Fetch locations
  const {
    data: locations = [],
    isLoading: locationsLoading,
    error: locationsError,
    refetch: refetchLocations
  } = useQuery({
    queryKey: ['app-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Location[];
    },
    refetchInterval: 60000, // Less frequent updates for locations
  });

  // Fetch services
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices
  } = useQuery({
    queryKey: ['app-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as Service[];
    },
    refetchInterval: 60000,
  });

  const isLoading = customersLoading || appointmentsLoading || locationsLoading || servicesLoading;
  const error = customersError || appointmentsError || locationsError || servicesError;

  const refetch = () => {
    refetchCustomers();
    refetchAppointments();
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
