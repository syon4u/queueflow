
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CustomerLocationService {
  id: string;
  customer_id: string | null;
  location_id: string | null;
  service_id: string | null;
  custom_location_name: string | null;
  custom_location_address: string | null;
  custom_service_name: string | null;
  custom_service_description: string | null;
  custom_service_duration: number | null;
  is_custom_location: boolean;
  is_custom_service: boolean;
  locations?: {
    id: string;
    name: string;
    address: string | null;
  } | null;
  services?: {
    id: string;
    name: string;
    duration: number;
    description: string | null;
  } | null;
}

export const useCustomerLocationServices = () => {
  const { data: customerLocationServices = [], isLoading, error } = useQuery({
    queryKey: ['customer-location-services'],
    queryFn: async (): Promise<CustomerLocationService[]> => {
      console.log('useCustomerLocationServices - Starting fetch...');
      
      try {
        const { data, error } = await supabase
          .from('customer_location_services')
          .select(`
            *,
            locations:location_id (
              id,
              name,
              address
            ),
            services:service_id (
              id,
              name,
              duration,
              description
            )
          `)
          .order('created_at', { ascending: false });
        
        console.log('useCustomerLocationServices - Raw query result:', { data, error });
        
        if (error) {
          console.error('useCustomerLocationServices - Database error:', error);
          throw new Error(`Failed to load customer location services: ${error.message}`);
        }
        
        return data || [];
        
      } catch (err) {
        console.error('useCustomerLocationServices - Fetch error:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  console.log('useCustomerLocationServices - Hook final state:', {
    customerLocationServicesCount: customerLocationServices?.length || 0,
    isLoading,
    error: error?.message || null
  });

  return { 
    data: customerLocationServices,
    isLoading,
    error: error?.message || null
  };
};
