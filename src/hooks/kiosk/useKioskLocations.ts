
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
    queryFn: async (): Promise<Location[]> => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, current_capacity, max_capacity')
        .eq('is_active', true);

      if (error) throw error;
      if (!data) return [];

      // Map with explicit typing to avoid inference issues
      return data.map((item) => ({
        id: String(item.id),
        name: String(item.name),
        current_capacity: Number(item.current_capacity) || 0,
        max_capacity: Number(item.max_capacity) || 50,
      })) as Location[];
    },
  });
};
