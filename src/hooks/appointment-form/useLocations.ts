
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  id: string;
  name: string;
  address: string;
  isCustom?: boolean;
  originalLocationId?: string;
}

export const useLocations = () => {
  // Query for standard locations
  const { data: standardLocations = [], isLoading: standardLoading, error: standardError } = useQuery({
    queryKey: ['locations', 'standard'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Fetching standard locations...');
      
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, address')
        .order('name');
      
      if (error) {
        console.error('useLocations - Standard locations error:', error);
        throw new Error(`Failed to load locations: ${error.message}`);
      }
      
      const locations = (data || []).map(location => ({
        ...location,
        address: location.address || '',
        isCustom: false
      }));
      
      console.log('useLocations - Standard locations loaded:', locations.length);
      return locations;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Query for custom locations (runs in parallel)
  const { data: customLocations = [] } = useQuery({
    queryKey: ['locations', 'custom'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Fetching custom locations...');
      
      try {
        const { data, error } = await supabase
          .from('customer_location_services')
          .select(`
            id,
            custom_location_name,
            custom_location_address,
            is_custom_location
          `)
          .eq('is_custom_location', true)
          .not('custom_location_name', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('useLocations - Custom locations error:', error);
          return []; // Don't throw error, just return empty array
        }
        
        const locations = (data || []).map(cls => ({
          id: cls.id,
          name: cls.custom_location_name || '',
          address: cls.custom_location_address || '',
          isCustom: true
        }));
        
        console.log('useLocations - Custom locations loaded:', locations.length);
        return locations;
      } catch (err) {
        console.error('useLocations - Custom locations fetch error:', err);
        return []; // Return empty array on error
      }
    },
    retry: 1, // Less retries for custom locations
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Combine both sets of locations
  const allLocations = [...standardLocations, ...customLocations];
  
  // Remove duplicates based on id and isCustom combination
  const uniqueLocations = allLocations.filter((location, index, self) => 
    index === self.findIndex(l => l.id === location.id && l.isCustom === location.isCustom)
  );

  console.log('useLocations - Final state:', {
    standardCount: standardLocations.length,
    customCount: customLocations.length,
    totalCount: uniqueLocations.length,
    isLoading: standardLoading,
    error: standardError?.message || null
  });

  return { 
    data: uniqueLocations,
    isLoading: standardLoading, // Only wait for standard locations
    error: standardError?.message || null
  };
};
