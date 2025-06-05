
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
}

interface Location {
  id: string;
  name: string;
  current_capacity: number;
  max_capacity: number;
}

export const useKioskServices = (selectedLocation: Location | null) => {
  return useQuery({
    queryKey: ['kiosk-services', selectedLocation?.id],
    enabled: !!selectedLocation,
    queryFn: async (): Promise<Service[]> => {
      if (!selectedLocation) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name, description, duration')
        .eq('location_id', selectedLocation.id)
        .eq('is_active', true);

      if (error) throw error;

      return (data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? '',
        duration: item.duration,
      }));
    },
  });
};
