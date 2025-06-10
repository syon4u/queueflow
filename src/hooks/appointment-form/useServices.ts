
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  duration: number;
  description?: string;
  isCustom?: boolean;
  originalServiceId?: string;
}

export const useServices = (locationId?: string) => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services', locationId],
    queryFn: async (): Promise<Service[]> => {
      console.log('useServices - Starting services fetch for location:', locationId);
      
      if (!locationId) {
        console.log('useServices - No location ID provided, returning empty array');
        return [];
      }
      
      try {
        // Fetch standard services for the location
        const { data: standardServices, error: standardError } = await supabase
          .from('services')
          .select('id, name, duration, description')
          .eq('location_id', locationId)
          .eq('is_active', true)
          .order('name');
        
        if (standardError) {
          console.error('useServices - Standard services error:', standardError);
          throw new Error(`Failed to load services: ${standardError.message}`);
        }
        
        // Fetch customer location services for custom services
        const { data: customerLocationServices, error: customerError } = await supabase
          .from('customer_location_services')
          .select(`
            id,
            service_id,
            custom_service_name,
            custom_service_description,
            custom_service_duration,
            is_custom_service,
            services:service_id (
              id,
              name,
              duration,
              description
            )
          `)
          .or(`location_id.eq.${locationId},id.eq.${locationId}`)
          .order('created_at', { ascending: false });
        
        if (customerError) {
          console.error('useServices - Customer services error:', customerError);
          // Don't throw error for customer services, just log and continue
        }
        
        console.log('useServices - Raw query results:', { 
          standardServices, 
          customerLocationServices 
        });
        
        const allServices: Service[] = [];
        
        // Add standard services
        if (standardServices) {
          standardServices.forEach(service => {
            allServices.push({
              ...service,
              isCustom: false
            });
          });
        }
        
        // Add custom services from customer location services
        if (customerLocationServices) {
          customerLocationServices.forEach(cls => {
            if (cls.is_custom_service && cls.custom_service_name) {
              allServices.push({
                id: cls.id,
                name: cls.custom_service_name,
                duration: cls.custom_service_duration || 30,
                description: cls.custom_service_description || undefined,
                isCustom: true,
                originalServiceId: cls.service_id
              });
            } else if (!cls.is_custom_service && cls.services) {
              // Also include linked standard services if not already present
              const existsInStandard = allServices.some(svc => 
                svc.id === cls.services?.id && !svc.isCustom
              );
              if (!existsInStandard) {
                allServices.push({
                  id: cls.services.id,
                  name: cls.services.name,
                  duration: cls.services.duration,
                  description: cls.services.description || undefined,
                  isCustom: false
                });
              }
            }
          });
        }
        
        // Remove duplicates based on id and isCustom combination
        const uniqueServices = allServices.filter((service, index, self) => 
          index === self.findIndex(s => s.id === service.id && s.isCustom === service.isCustom)
        );
        
        return uniqueServices;
        
      } catch (err) {
        console.error('useServices - Fetch error:', err);
        throw err;
      }
    },
    enabled: !!locationId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  console.log('useServices - Hook final state:', {
    servicesCount: services?.length || 0,
    services: services,
    isLoading,
    error: error?.message || null
  });

  return { 
    data: services,
    isLoading,
    error: error?.message || null
  };
};
