
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  duration: number;
  description?: string;
  location_id?: string; // Now optional since services can be global
  isCustom?: boolean;
  originalServiceId?: string;
}

export const useServices = (locationId?: string) => {
  // Query for standard services (both global and location-specific)
  const { data: standardServices = [], isLoading: standardLoading, error: standardError } = useQuery({
    queryKey: ['services', 'standard', locationId],
    queryFn: async (): Promise<Service[]> => {
      console.log('useServices - Fetching standard services for location:', locationId);
      
      let query = supabase
        .from('services')
        .select('id, name, duration, description, location_id')
        .eq('is_active', true)
        .order('name');
      
      // If locationId is provided, get both global services (location_id is null) and location-specific services
      if (locationId) {
        query = query.or(`location_id.is.null,location_id.eq.${locationId}`);
      } else {
        // If no locationId, only get global services
        query = query.is('location_id', null);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('useServices - Standard services error:', error);
        throw new Error(`Failed to load services: ${error.message}`);
      }
      
      const services = (data || []).map(service => ({
        ...service,
        isCustom: false
      }));
      
      console.log('useServices - Standard services loaded:', services.length);
      return services;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Query for custom services (runs in parallel) - only if locationId is provided
  const { data: customServices = [] } = useQuery({
    queryKey: ['services', 'custom', locationId],
    queryFn: async (): Promise<Service[]> => {
      console.log('useServices - Fetching custom services for location:', locationId);
      
      if (!locationId) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('customer_location_services')
          .select(`
            id,
            custom_service_name,
            custom_service_description,
            custom_service_duration,
            is_custom_service
          `)
          .or(`location_id.eq.${locationId},id.eq.${locationId}`)
          .eq('is_custom_service', true)
          .not('custom_service_name', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('useServices - Custom services error:', error);
          return []; // Don't throw error, just return empty array
        }
        
        const services = (data || []).map(cls => ({
          id: cls.id,
          name: cls.custom_service_name || '',
          duration: cls.custom_service_duration || 30,
          description: cls.custom_service_description || undefined,
          isCustom: true
        }));
        
        console.log('useServices - Custom services loaded:', services.length);
        return services;
      } catch (err) {
        console.error('useServices - Custom services fetch error:', err);
        return []; // Return empty array on error
      }
    },
    enabled: !!locationId,
    retry: 1, // Less retries for custom services
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Combine both sets of services
  const allServices = [...standardServices, ...customServices];
  
  // Remove duplicates based on id and isCustom combination
  const uniqueServices = allServices.filter((service, index, self) => 
    index === self.findIndex(s => s.id === service.id && s.isCustom === service.isCustom)
  );

  console.log('useServices - Final state:', {
    locationId,
    standardCount: standardServices.length,
    customCount: customServices.length,
    totalCount: uniqueServices.length,
    isLoading: standardLoading,
    error: standardError?.message || null
  });

  return { 
    data: uniqueServices,
    isLoading: standardLoading, // Only wait for standard services
    error: standardError?.message || null
  };
};
