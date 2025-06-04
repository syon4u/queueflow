
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CapacityCheckResult {
  has_capacity: boolean;
  current_capacity: number;
  max_capacity: number;
  max_allowed: number;
  available_spots: number;
  buffer_amount: number;
}

export function useCapacityCheck(locationId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['capacity-check', locationId],
    queryFn: async (): Promise<CapacityCheckResult> => {
      const { data, error } = await supabase.rpc('check_location_capacity', {
        location_uuid: locationId
      });

      if (error) throw error;
      return data as unknown as CapacityCheckResult;
    },
    enabled: enabled && !!locationId,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 15000 // Consider data stale after 15 seconds
  });
}
