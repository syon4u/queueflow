
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  location_id: string;
  staff_id?: string;
  scheduled_time: string;
  check_in_time?: string;
  start_time?: string;
  end_time?: string;
  status: string;
  reason_for_visit?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface RealtimeAppointmentsReturn {
  appointments: Appointment[];
  userPosition: number | null;
  estimatedWaitTime: number | null;
  isLoading: boolean;
  error: string | null;
  refreshAppointments: () => void;
}

export const useRealtimeAppointments = (): RealtimeAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      console.log('useRealtimeAppointments - Starting fetch...');
      setIsLoading(true);
      
      // Fetch all appointments for anonymous users
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('useRealtimeAppointments - Error fetching appointments:', error);
        setError('Failed to load appointments');
        setAppointments([]);
      } else {
        console.log('useRealtimeAppointments - Fetched appointments:', data?.length || 0);
        setAppointments(data || []);
        setError(null);
      }
      
      // For anonymous users, no specific position or wait time
      setUserPosition(null);
      setEstimatedWaitTime(null);
      
    } catch (err) {
      console.error('useRealtimeAppointments - Error fetching appointments:', err);
      setError('Failed to load appointment data');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useRealtimeAppointments - Setting up subscription and initial fetch');
    
    let subscription: any = null;

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

  const refreshAppointments = () => {
    console.log('useRealtimeAppointments - Manual refresh triggered');
    fetchAppointments();
  };

  return {
    appointments,
    userPosition,
    estimatedWaitTime,
    isLoading,
    error,
    refreshAppointments,
  };
};
