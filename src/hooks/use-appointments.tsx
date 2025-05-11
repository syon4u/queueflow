
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type AppointmentStatus = 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  location_id: string;
  staff_id: string | null;
  status: AppointmentStatus;
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useAppointments(serviceId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    // Fetch initial appointments
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('appointments');
        
        if (error) throw error;
        
        if (data) {
          setAppointments(data);
          calculateUserPosition(data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointments',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Set up real-time subscription
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'appointments'
        }, 
        (payload) => {
          // Refresh the appointment list when changes occur
          fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, serviceId, toast]);

  // Calculate user's position in queue and estimated wait time
  const calculateUserPosition = (appointmentsData: Appointment[]) => {
    if (!user) return;

    // Find user's appointment
    const userAppointment = appointmentsData.find(a => a.customer_id === user.id);
    if (!userAppointment) return;

    // Count how many people are ahead in the queue
    const scheduledAppointments = appointmentsData.filter(a => 
      (a.status === 'scheduled' || a.status === 'checked_in') && 
      new Date(a.scheduled_time) <= new Date(userAppointment.scheduled_time) &&
      a.id !== userAppointment.id
    );

    // Sort by scheduled time
    scheduledAppointments.sort((a, b) => 
      new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
    );

    const position = scheduledAppointments.length + 1;
    setUserPosition(position);

    // Estimate wait time (15 minutes per person ahead)
    const waitTimeInMinutes = (position - 1) * 15;
    setEstimatedWaitTime(waitTimeInMinutes);
  };

  return { 
    appointments, 
    loading, 
    userPosition,
    estimatedWaitTime
  };
}
