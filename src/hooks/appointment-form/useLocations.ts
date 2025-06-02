
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('Starting location fetch...');
      
      try {
        // First, try to get open locations
        const { data: openData, error: openError } = await supabase
          .from('locations')
          .select('id, name, address')
          .eq('queue_status', 'open')
          .order('name');
        
        console.log('Open query result:', { data: openData, error: openError });
        
        if (openError) {
          console.error('Supabase error details:', {
            code: openError.code,
            message: openError.message,
            hint: openError.hint
          });
          throw new Error(`Failed to fetch locations: ${openError.message}`);
        }
        
        // If we have open locations, return them
        if (openData && openData.length > 0) {
          return openData;
        }
        
        // No open locations, fetch all locations as fallback
        console.log('No open locations, fetching all...');
        const { data: allData, error: allError } = await supabase
          .from('locations')
          .select('id, name, queue_status')
          .order('name');
        
        console.log('All locations result:', { data: allData, error: allError });
        
        if (allError) {
          console.error('Supabase error details:', {
            code: allError.code,
            message: allError.message,
            hint: allError.hint
          });
          throw new Error(`Failed to fetch all locations: ${allError.message}`);
        }
        
        // Return all locations or empty array
        return allData || [];
      } catch (err) {
        console.error('Location fetch error:', err);
        throw err;
      }
    },
    retry: (failureCount, error) => {
      console.log(`Retry attempt ${failureCount}:`, error?.message);
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { 
    locations,
    isLoading,
    error: error?.message || null
  };
};
