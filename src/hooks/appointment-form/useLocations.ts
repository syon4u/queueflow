
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  id: string;
  name: string;
  address: string; // Make required to match LocationRow
  isCustom?: boolean;
  originalLocationId?: string;
}

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Starting location fetch...');
      
      try {
        // Fetch standard locations
        const { data: standardLocations, error: standardError } = await supabase
          .from('locations')
          .select('id, name, address')
          .order('name');
        
        if (standardError) {
          console.error('useLocations - Standard locations error:', standardError);
          throw new Error(`Failed to load locations: ${standardError.message}`);
        }
        
        // Fetch customer location services for custom locations
        const { data: customerLocationServices, error: customerError } = await supabase
          .from('customer_location_services')
          .select(`
            id,
            location_id,
            custom_location_name,
            custom_location_address,
            is_custom_location,
            locations:location_id (
              id,
              name,
              address
            )
          `)
          .order('created_at', { ascending: false });
        
        if (customerError) {
          console.error('useLocations - Customer locations error:', customerError);
          // Don't throw error for customer locations, just log and continue
        }
        
        console.log('useLocations - Raw query results:', { 
          standardLocations, 
          customerLocationServices 
        });
        
        const allLocations: Location[] = [];
        
        // Add standard locations
        if (standardLocations) {
          standardLocations.forEach(location => {
            allLocations.push({
              ...location,
              address: location.address || '',
              isCustom: false
            });
          });
        }
        
        // Add custom locations from customer location services
        if (customerLocationServices) {
          customerLocationServices.forEach(cls => {
            if (cls.is_custom_location && cls.custom_location_name) {
              allLocations.push({
                id: cls.id,
                name: cls.custom_location_name,
                address: cls.custom_location_address || '',
                isCustom: true,
                originalLocationId: cls.location_id
              });
            } else if (!cls.is_custom_location && cls.locations) {
              // Also include linked standard locations if not already present
              const existsInStandard = allLocations.some(loc => 
                loc.id === cls.locations?.id && !loc.isCustom
              );
              if (!existsInStandard) {
                allLocations.push({
                  id: cls.locations.id,
                  name: cls.locations.name,
                  address: cls.locations.address || '',
                  isCustom: false
                });
              }
            }
          });
        }
        
        // Remove duplicates based on id and isCustom combination
        const uniqueLocations = allLocations.filter((location, index, self) => 
          index === self.findIndex(l => l.id === location.id && l.isCustom === location.isCustom)
        );
        
        return uniqueLocations;
        
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
