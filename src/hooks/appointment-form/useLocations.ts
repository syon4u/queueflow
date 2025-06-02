
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Fetching locations for anonymous user...');
      
      // For anonymous users, we need to fetch locations without authentication
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, address')
        .eq('queue_status', 'open') // Only show open locations
        .order('name');
      
      if (error) {
        console.error('useLocations - Error fetching locations:', error);
        throw error;
      }
      
      console.log('useLocations - Locations fetched successfully:', data);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
  });

  return { 
    locations,
    isLoading,
    error: error?.message || null
  };
};
