
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';

export const useLocations = () => {
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('🔍 useLocations - Starting location fetch...');
      
      try {
        // First, let's test basic Supabase connectivity
        console.log('🔍 useLocations - Testing Supabase client:', supabase);
        
        // Test with a simple query first
        const { data: testData, error: testError } = await supabase
          .from('locations')
          .select('count')
          .limit(1);
        
        console.log('🔍 useLocations - Basic connectivity test:', { testData, testError });
        
        if (testError) {
          console.error('❌ useLocations - Basic connectivity failed:', testError);
          throw new Error(`Connectivity test failed: ${testError.message}`);
        }
        
        // Now try the actual query
        console.log('🔍 useLocations - Attempting main query...');
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, address')
          .eq('queue_status', 'open')
          .order('name');
        
        console.log('🔍 useLocations - Main query result:', { data, error });
        
        if (error) {
          console.error('❌ useLocations - Main query error:', error);
          console.error('❌ useLocations - Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw new Error(`Failed to fetch locations: ${error.message}`);
        }
        
        console.log('✅ useLocations - Query successful, data:', data);
        console.log('✅ useLocations - Number of locations found:', data?.length || 0);
        
        // If no open locations, let's check what locations exist at all
        if (!data || data.length === 0) {
          console.log('⚠️ useLocations - No open locations found, checking all locations...');
          const { data: allLocations, error: allError } = await supabase
            .from('locations')
            .select('id, name, queue_status')
            .order('name');
          
          console.log('🔍 useLocations - All locations:', { allLocations, allError });
          
          if (allLocations && allLocations.length > 0) {
            console.log('📋 useLocations - Available locations with status:');
            allLocations.forEach(loc => {
              console.log(`  - ${loc.name}: ${loc.queue_status}`);
            });
          } else {
            console.log('❌ useLocations - No locations found in database at all');
          }
        }
        
        return data || [];
      } catch (err) {
        console.error('💥 useLocations - Catch block error:', err);
        console.error('💥 useLocations - Error stack:', err instanceof Error ? err.stack : 'No stack trace');
        throw err;
      }
    },
    retry: (failureCount, error) => {
      console.log(`🔄 useLocations - Retry attempt ${failureCount}:`, error?.message);
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  console.log('📊 useLocations - Hook final state:', {
    locationsCount: locations?.length || 0,
    isLoading,
    error: error?.message || null,
    locations: locations
  });

  return { 
    locations,
    isLoading,
    error: error?.message || null
  };
};
