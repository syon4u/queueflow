
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string; // Make required to match ServiceRow
  duration: number;
  location_id?: string;
}

export const useServices = (locationId?: string) => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services', locationId],
    queryFn: async (): Promise<Service[]> => {
      console.log('useServices - Starting service fetch for location:', locationId);
      
      try {
        let query = supabase
          .from('services')
          .select('id, name, description, duration, location_id')
          .eq('is_active', true)
          .order('name');
        
        if (locationId) {
          query = query.eq('location_id', locationId);
        }
        
        const { data, error } = await query;
        
        console.log('useServices - Raw query result:', { data, error });
        
        if (error) {
          console.error('useServices - Database error:', error);
          throw new Error(`Failed to load services: ${error.message}`);
        }
        
        // Ensure description is not null to match the interface
        const servicesWithDescription = (data ?? []).map(service => ({
          ...service,
          description: service.description || '' // Default to empty string if null
        }));
        
        return servicesWithDescription;
        
      } catch (err) {
        console.error('useServices - Fetch error:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  console.log('useServices - Hook final state:', {
    servicesCount: services?.length || 0,
    services: services,
    isLoading,
    error: error?.message || null,
    locationId
  });

  return { 
    data: services,
    isLoading,
    error: error?.message || null
  };
};
