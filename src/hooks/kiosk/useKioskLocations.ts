
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  id: string;
  name: string;
  current_capacity: number;
  max_capacity: number;
}

export const useKioskLocations = () => {
  return useQuery({
    queryKey: ['kiosk-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, current_capacity, max_capacity')
        .eq('is_active', true);

      if (error) throw error;

      // Explicitly type the raw data to avoid deep type inference
      const rawLocations = data as Array<{
        id: string;
        name: string;
        current_capacity: number | null;
        max_capacity: number | null;
      }> | null;

      const locations: Location[] = (rawLocations ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        current_capacity: item.current_capacity ?? 0,
        max_capacity: item.max_capacity ?? 50,
      }));

      return locations;
    },
  });
};
