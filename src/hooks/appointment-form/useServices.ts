
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ServiceRow } from '@/types/supabase';

export const useServices = () => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<ServiceRow[]> => {
      console.log('useServices - Starting service fetch...');
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, description, duration')
          .eq('is_active', true)
          .order('name');
        
        console.log('useServices - Raw query result:', { data, error });
        
        if (error) {
          console.error('useServices - Database error:', error);
          throw new Error(`Failed to load services: ${error.message}`);
        }
        
        if (!data) {
          console.warn('useServices - No data returned from query');
          return [];
        }
        
        console.log('useServices - Successfully fetched services:', data.length);
        return data;
        
      } catch (err) {
        console.error('useServices - Fetch error:', err);
        throw err;
      }
    },
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
    services,
    isLoading,
    error: error?.message || null
  };
};
