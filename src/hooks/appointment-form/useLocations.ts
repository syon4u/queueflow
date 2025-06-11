
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  id: string;
  name: string;
  address: string; // Make required to match LocationRow
}

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Starting location fetch...');
      
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, address')
          .order('name');
        
        console.log('useLocations - Raw query result:', { data, error });
        
        if (error) {
          console.error('useLocations - Database error:', error);
          throw new Error(`Failed to load locations: ${error.message}`);
        }
        
        // Ensure address is not null to match the interface
        const locationsWithAddress = (data ?? []).map(location => ({
          ...location,
          address: location.address || '' // Default to empty string if null
        }));
        
        return locationsWithAddress;
        
      } catch (err) {
        console.error('useLocations - Fetch error:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    data: locations,
    isLoading,
    error: error?.message || null
  };
};
