
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Fetching locations for anonymous user...');
      
      // For anonymous users, we can now fetch locations thanks to RLS policy
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
      console.log('useLocations - Number of locations:', data?.length || 0);
      return data || [];
    },
    retry: 1, // Reduce retries since we've fixed the RLS issue
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  console.log('useLocations - Hook state:', {
    locationsCount: locations?.length || 0,
    isLoading,
    error: error?.message || null
  });

  return { 
    locations,
    isLoading,
    error: error?.message || null
  };
};
