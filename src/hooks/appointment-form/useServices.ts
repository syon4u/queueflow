
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service } from './types';

export const useServices = (selectedLocationId: string) => {
  const { 
    data: services = [], 
    isLoading: servicesLoading, 
    error: servicesError 
  } = useQuery({
    queryKey: ['services', selectedLocationId],
    queryFn: async (): Promise<Service[]> => {
      console.log('useServices - Fetching services for location:', selectedLocationId);
      
      if (!selectedLocationId) {
        console.log('useServices - No location selected, returning empty array');
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, duration, description')
          .eq('location_id', selectedLocationId)
          .eq('is_active', true)
          .order('name');
        
        console.log('useServices - Query result:', { data, error });
        
        if (error) {
          console.error('useServices - Database error:', error);
          throw new Error(`Failed to load services: ${error.message}`);
        }
        
        const result = data || [];
        console.log('useServices - Returning services:', result.length);
        return result;
        
      } catch (err) {
        console.error('useServices - Fetch error:', err);
        throw err;
      }
    },
    enabled: !!selectedLocationId,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  console.log('useServices - Hook state:', {
    selectedLocationId,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError: servicesError?.message || null
  });

  return {
    services,
    servicesLoading,
    servicesError: servicesError?.message || null
  };
};
