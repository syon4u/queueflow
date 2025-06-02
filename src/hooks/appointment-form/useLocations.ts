
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Location } from './types';

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Starting location fetch...');
      
      try {
        // Fetch all locations (not just open ones for now to debug)
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, address')
          .order('name');
        
        console.log('useLocations - Raw query result:', { data, error });
        
        if (error) {
          console.error('useLocations - Database error:', error);
          throw new Error(`Failed to load locations: ${error.message}`);
        }
        
        const result = data || [];
        console.log('useLocations - Final locations result:', result);
        return result;
        
      } catch (err) {
        console.error('useLocations - Fetch error:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  console.log('useLocations - Hook final state:', {
    locationsCount: locations?.length || 0,
    locations: locations,
    isLoading,
    error: error?.message || null
  });

  return { 
    locations,
    isLoading,
    error: error?.message || null
  };
};
