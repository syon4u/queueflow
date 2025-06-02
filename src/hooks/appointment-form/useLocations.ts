
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';

export const useLocations = () => {
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useLocations - Fetching locations...');
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, address')
        .order('name');
      
      if (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
      
      console.log('useLocations - Locations fetched:', data);
      return data || [];
    },
  });

  return { locations };
};
