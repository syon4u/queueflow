
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
      
      // For anonymous users, we can now fetch services thanks to RLS policy
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
      console.log('useServices - Number of services:', data?.length || 0);
      return data || [];
    },
    enabled: !!selectedLocationId,
    retry: 1, // Reduce retries since we've fixed the RLS issue
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  console.log('useServices - Hook state:', {
    selectedLocationId,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError: servicesError?.message || null
  });

  return {
    services,
    servicesLoading,
    servicesError: servicesError?.message || null
  };
};
