
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment change detected:', payload);
          
          // Invalidate relevant queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['power-user-stats'] });
          queryClient.invalidateQueries({ queryKey: ['reports-analytics'] });
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_communications'
        },
        (payload) => {
          console.log('Communication change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['sms-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['power-user-administration'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
