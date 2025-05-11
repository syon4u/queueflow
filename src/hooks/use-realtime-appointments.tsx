
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { AppointmentStatus, Appointment } from '@/hooks/use-appointments';

/**
 * Hook to fetch and subscribe to realtime appointment updates
 * @param locationId Optional location id to filter appointments
 * @returns Object containing appointments data, loading state, error state, and user queue position info
 */
export function useRealtimeAppointments(locationId?: string) {
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Create a fetcher function for SWR
  const fetchAppointments = async () => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase.functions.invoke('appointments');
    
    if (error) throw error;
    
    // Filter by location if specified
    const filteredData = locationId 
      ? data.filter((appointment: Appointment) => appointment.location_id === locationId)
      : data;
    
    return filteredData;
  };

  // Use SWR for data fetching with cache and revalidation
  const { 
    data: appointments, 
    error, 
    isLoading, 
    mutate 
  } = useSWR(
    user ? ['appointments', locationId, user.id] : null,
    fetchAppointments,
    {
      refreshInterval: 0, // Disable polling as we'll use realtime
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        if (data) {
          calculateUserPosition(data);
        }
      },
      onError: (err) => {
        console.error('Error fetching appointments:', err);
        toast({
          title: 'Error',
          description: 'Failed to load appointments',
          variant: 'destructive',
        });
      }
    }
  );

  // Setup realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'appointments'
        }, 
        () => {
          // When any appointment changes, revalidate the data
          mutate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, mutate]);

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
    appointments: appointments || [],
    isLoading, 
    error,
    userPosition,
    estimatedWaitTime,
    refreshAppointments: mutate
  };
}
