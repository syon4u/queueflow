
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  reason_for_visit: string | null;
  created_at: string;
  updated_at: string;
  // Additional fields from joins
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  service?: {
    name: string;
    duration: number;
    description: string;
  };
  location?: {
    name: string;
    address: string;
  };
  staff?: {
    first_name: string;
    last_name: string;
  };
}

export function useAppointments(serviceId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
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

      // Filter by service if provided
      if (serviceId) {
        query = query.eq('service_id', serviceId);
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
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading appointments.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate user's position in queue and estimated wait time
  const calculateUserPosition = (appointmentsData: Appointment[]) => {
    // This would need actual user context to work properly
    // For now, we'll just calculate based on checked-in appointments
    const checkedInAppointments = appointmentsData.filter(a => 
      a.status === 'checked_in' || a.status === 'in_progress'
    );

    // Sort by check-in time for accurate queue position
    checkedInAppointments.sort((a, b) => {
      const aTime = a.check_in_time ? new Date(a.check_in_time).getTime() : 0;
      const bTime = b.check_in_time ? new Date(b.check_in_time).getTime() : 0;
      return aTime - bTime;
    });

    setUserPosition(checkedInAppointments.length);
    setEstimatedWaitTime(checkedInAppointments.length * 15); // 15 minutes per person estimate
  };

  const refreshAppointments = () => {
    fetchAppointments();
  };

  // Set up realtime subscription
  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'appointments'
        }, 
        (payload) => {
          console.log('Appointment change detected:', payload);
          fetchAppointments(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [serviceId]);

  return { 
    appointments, 
    loading, 
    error,
    userPosition,
    estimatedWaitTime,
    refreshAppointments
  };
}
