
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service } from './types';

export const useServices = (selectedLocationId: string) => {
  const { 
    data: services = [], 
    isLoading: servicesLoading, 
    error: servicesError 
  } = useQuery({
    queryKey: ['services', selectedLocationId],
    queryFn: async (): Promise<Service[]> => {
      console.log('useServices - Fetching services for location:', selectedLocationId);
      
      if (!selectedLocationId) {
        console.log('useServices - No location selected, returning empty array');
        return [];
      }
      
      // For anonymous users, fetch services without authentication
      const { data, error } = await supabase
        .from('services')
        .select('id, name, duration, description')
        .eq('location_id', selectedLocationId)
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('useServices - Error fetching services:', error);
        throw error;
      }
      
      console.log('useServices - Services fetched successfully:', data);
      return data || [];
    },
    enabled: !!selectedLocationId,
    retry: 3,
    retryDelay: 1000,
  });

  return {
    services,
    servicesLoading,
    servicesError: servicesError?.message || null
  };
};
