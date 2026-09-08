
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Json } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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
  operating_hours: Json | null;
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

/**
 * Which lists a caller actually renders. Anything left out is not fetched
 * (and does not count towards `isLoading`) -- the point is that a page shell
 * can warm the small public lists without pulling the full `appointments`
 * or `customers` tables before first paint. Callers that omit the options get
 * the historical default: locations, services and appointments.
 *
 * `customers` is off by default: nothing renders it directly (Customer Search
 * runs its own narrower query), so it is only fetched when explicitly asked.
 */
export interface AppDataOptions {
  locations?: boolean;
  services?: boolean;
  appointments?: boolean;
  customers?: boolean;
}

export const APP_DATA_QUERY_KEYS = {
  locations: ['app-locations'],
  services: ['app-services'],
  customers: ['app-customers'],
  appointments: ['app-appointments'],
} as const;

// Stable empty list so `useMemo`/`useEffect` deps keyed on these arrays don't
// see a fresh `[]` on every render while a query is disabled or still pending.
const EMPTY_LIST: never[] = [];

/**
 * Invalidates every app-data list that is currently mounted. Unlike calling
 * `refetch()` on each query, this does not fire requests for lists no
 * component is rendering.
 */
export const useRefetchAppData = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    for (const key of Object.values(APP_DATA_QUERY_KEYS)) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  }, [queryClient]);
};

export const useAppData = (options: AppDataOptions = {}): AppData => {
  const {
    locations: wantLocations = true,
    services: wantServices = true,
    appointments: wantAppointments = true,
    customers: wantCustomers = false,
  } = options;
  const { user, role } = useAuth();
  const isStaffUser = !!user && ['staff', 'power_user', 'admin'].includes(role || '');

  // Fetch locations - now public
  const {
    data: locations = EMPTY_LIST,
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery({
    queryKey: APP_DATA_QUERY_KEYS.locations,
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
    enabled: wantLocations,
    staleTime: 60000,
    refetchInterval: 60000,
  });

  // Fetch services - now public
  const {
    data: services = EMPTY_LIST,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: APP_DATA_QUERY_KEYS.services,
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
    enabled: wantServices,
    staleTime: 60000,
    refetchInterval: 60000,
  });

  // Fetch customers - only for authenticated staff, and only when asked for
  const {
    data: customers = EMPTY_LIST,
    isLoading: customersLoading,
    error: customersError,
  } = useQuery({
    queryKey: APP_DATA_QUERY_KEYS.customers,
    queryFn: async () => {
      console.log('Fetching customers for app data...');
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      
      console.log('App data customers loaded:', data?.length || 0);
      return data as Customer[];
    },
    enabled: wantCustomers && isStaffUser,
    staleTime: 30000,
    refetchInterval: 30000,
  });

  // Fetch appointments - only for authenticated staff
  const {
    data: appointments = EMPTY_LIST,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useQuery({
    queryKey: APP_DATA_QUERY_KEYS.appointments,
    queryFn: async () => {
      console.log('Fetching appointments for app data...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers!appointments_customer_id_fkey(*),
          services!appointments_service_id_fkey(*),
          locations!appointments_location_id_fkey(*)
        `)
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
      
      console.log('App data appointments loaded:', data?.length || 0);
      return data as Appointment[];
    },
    enabled: wantAppointments && isStaffUser,
    staleTime: 30000,
    refetchInterval: 30000,
  });

  const isLoading = locationsLoading || servicesLoading || customersLoading || appointmentsLoading;
  const error = locationsError || servicesError || customersError || appointmentsError;

  const refetch = useRefetchAppData();

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
