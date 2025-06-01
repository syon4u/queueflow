
import { useState, useEffect } from 'react';
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch appointments from the database
  const fetchAppointments = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select(`
          *,
          customers:customer_id (
            first_name,
            last_name,
            email,
            phone
          ),
          services:service_id (
            name,
            duration,
            description
          ),
          locations:location_id (
            name,
            address
          ),
          staff:staff_id (
            first_name,
            last_name
          )
        `)
        .order('scheduled_time', { ascending: true });
      
      // Filter by location if specified
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('Error fetching appointments:', fetchError);
        setError(fetchError.message);
        toast({
          title: 'Error',
          description: 'Failed to load appointments. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      const formattedAppointments = (data || []).map(appointment => ({
        ...appointment,
        customer: appointment.customers,
        service: appointment.services,
        location: appointment.locations,
        staff: appointment.staff
      }));
      
      setAppointments(formattedAppointments);
      calculateUserPosition(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('An unexpected error occurred');
      toast({
        title: 'Error',
        description: 'Failed to load appointments. Using cached data if available.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel('appointments-notifications')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'appointments'
        }, 
        (payload) => {
          console.log('Realtime appointment update:', payload);
          // Refresh appointments when any change occurs
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, locationId]);

  // Calculate user's position in queue and estimated wait time
  const calculateUserPosition = (appointmentsData: Appointment[]) => {
    if (!user) return;

    // Find user's appointment
    const userAppointment = appointmentsData.find(a => a.customer_id === user.id);
    if (!userAppointment) return;

    // Only count checked-in appointments ahead in the queue
    const checkedInAppointments = appointmentsData.filter(a => 
      (a.status === 'checked_in' || a.status === 'in_progress') && 
      ((a.check_in_time && userAppointment.check_in_time && 
        new Date(a.check_in_time) <= new Date(userAppointment.check_in_time)) ||
       (a.status === 'checked_in' && userAppointment.status === 'scheduled')) &&
      a.id !== userAppointment.id
    );

    // Sort by check-in time for more accurate queue position
    checkedInAppointments.sort((a, b) => {
      const aTime = a.check_in_time ? new Date(a.check_in_time).getTime() : 0;
      const bTime = b.check_in_time ? new Date(b.check_in_time).getTime() : 0;
      return aTime - bTime;
    });

    const position = checkedInAppointments.length + 1;
    setUserPosition(position);

    // Estimate wait time (15 minutes per person ahead)
    const waitTimeInMinutes = (position - 1) * 15;
    setEstimatedWaitTime(waitTimeInMinutes);
  };

  return { 
    appointments,
    isLoading, 
    error,
    userPosition,
    estimatedWaitTime,
    refreshAppointments: fetchAppointments
  };
}
