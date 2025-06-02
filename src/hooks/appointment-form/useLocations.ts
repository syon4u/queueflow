
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Location } from './types';

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('Starting location fetch...');
      
      try {
        // First, try to get open locations
        console.log('Attempting to fetch open locations...');
        const { data: openData, error: openError } = await supabase
          .from('locations')
          .select('id, name, address')
          .eq('queue_status', 'open')
          .order('name');
        
        console.log('Open query result:', { data: openData, error: openError });
        
        // If we have open locations, return them
        if (openData && openData.length > 0) {
          console.log('Found open locations:', openData.length);
          return openData;
        }
        
        // No open locations, fetch all locations as fallback
        console.log('No open locations, fetching all...');
        const { data: allData, error: allError } = await supabase
          .from('locations')
          .select('id, name, queue_status')
          .order('name');
        
        console.log('All locations result:', { data: allData, error: allError });
        
        // Return all locations or empty array
        const result = allData || [];
        console.log('Final result:', result);
        return result;
        
      } catch (err) {
        console.error('Location fetch error:', err);
        // Return empty array instead of throwing to allow the form to still render
        return [];
      }
    },
    retry: (failureCount, error) => {
      console.log(`Retry attempt ${failureCount}:`, error?.message);
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // Ensure the query runs immediately without any conditions
    enabled: true,
  });

  console.log('useLocations - Hook final state:', {
    locationsCount: locations?.length || 0,
    isLoading,
    error: error?.message || null
  });

  return { 
    locations,
    isLoading,
    error: error?.message || null
  };
};
