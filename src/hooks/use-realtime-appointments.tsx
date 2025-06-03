
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/hooks/use-appointments';

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
      
      // Fetch appointments for today with customer and service details
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers(first_name, last_name, phone),
          services(name, duration),
          locations(name)
        `)
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`)
        .in('status', ['scheduled', 'checked_in', 'in_progress'])
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('useRealtimeAppointments - Error fetching appointments:', error);
        setError('Failed to load appointments');
        setAppointments([]);
      } else {
        console.log('useRealtimeAppointments - Fetched appointments:', data?.length || 0);
        
        // Map the data to ensure staff_id is always present (set to null if undefined)
        const mappedAppointments = (data || []).map(appointment => ({
          ...appointment,
          staff_id: appointment.staff_id || null,
        })) as Appointment[];
        
        setAppointments(mappedAppointments);
        
        // Calculate queue positions for checked-in appointments
        const checkedInAppointments = mappedAppointments.filter(apt => apt.status === 'checked_in');
        
        if (checkedInAppointments.length > 0) {
          // For demo purposes, simulate that the first checked-in appointment is "user's"
          // In a real app, you'd match by user authentication or phone number
          const userAppointment = checkedInAppointments[0];
          const position = checkedInAppointments.findIndex(apt => apt.id === userAppointment.id) + 1;
          
          setUserPosition(position);
          
          // Estimate wait time: 15 minutes per person ahead in queue
          const waitTime = Math.max(0, (position - 1) * 15);
          setEstimatedWaitTime(waitTime);
        } else {
          setUserPosition(null);
          setEstimatedWaitTime(null);
        }
        
        setError(null);
      }
      
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

    // Set up realtime subscription for appointment updates
    const setupSubscription = () => {
      subscription = supabase
        .channel('appointments_updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments' }, 
          (payload) => {
            console.log('useRealtimeAppointments - Real-time update:', payload);
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
