
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeAppointmentsReturn {
  userPosition: number | null;
  estimatedWaitTime: number | null;
  isLoading: boolean;
  error: string | null;
}

export const useRealtimeAppointments = (): RealtimeAppointmentsReturn => {
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useRealtimeAppointments - Setting up subscription and initial fetch');
    
    let subscription: any = null;
    
    const fetchAppointments = async () => {
      try {
        console.log('useRealtimeAppointments - Starting fetch...');
        
        // For anonymous users, just show sample data or empty state
        setUserPosition(null);
        setEstimatedWaitTime(null);
        setError(null);
        setIsLoading(false);
        
      } catch (err) {
        console.error('useRealtimeAppointments - Error fetching appointments:', err);
        setError('Failed to load appointment data');
        setIsLoading(false);
      }
    };

    // Set up realtime subscription for general queue updates
    const setupSubscription = () => {
      subscription = supabase
        .channel('appointments_updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments' }, 
          () => {
            // Refresh data when appointments change
            fetchAppointments();
          }
        )
        .subscribe((status) => {
          console.log('useRealtimeAppointments - Subscription status:', status);
        });
    };

    fetchAppointments();
    setupSubscription();

    return () => {
      console.log('useRealtimeAppointments - Cleaning up subscription');
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return {
    userPosition,
    estimatedWaitTime,
    isLoading,
    error,
  };
};
