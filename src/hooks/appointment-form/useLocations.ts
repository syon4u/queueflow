
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Starting location fetch...');
      
      try {
        // First, let's check if we can connect to the database at all
        const { data: testData, error: testError } = await supabase
          .from('locations')
          .select('count')
          .limit(1);
        
        console.log('useLocations - Database connection test:', { testData, testError });
        
        // Now fetch the actual locations
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, address')
          .eq('queue_status', 'open')
          .order('name');
        
        console.log('useLocations - Raw query result:', { data, error });
        
        if (error) {
          console.error('useLocations - Supabase error:', error);
          throw new Error(`Failed to fetch locations: ${error.message}`);
        }
        
        console.log('useLocations - Locations fetched successfully:', data);
        console.log('useLocations - Number of locations:', data?.length || 0);
        
        // If no open locations, let's check if there are any locations at all
        if (!data || data.length === 0) {
          const { data: allLocations, error: allError } = await supabase
            .from('locations')
            .select('id, name, queue_status')
            .order('name');
          
          console.log('useLocations - All locations check:', { allLocations, allError });
        }
        
        return data || [];
      } catch (err) {
        console.error('useLocations - Catch block error:', err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  console.log('useLocations - Hook final state:', {
    locationsCount: locations?.length || 0,
    isLoading,
    error: error?.message || null,
    locations: locations
  });

  return { 
    locations,
    isLoading,
    error: error?.message || null
  };
};
