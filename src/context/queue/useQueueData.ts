
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Customer } from './types';
import { isInServiceNow, isNoShowToday, isServedToday, isWaitingNow, todayMetricsOrFilter } from '@/lib/dateRanges';

// Helper function to map appointment status to customer status
const mapAppointmentStatusToCustomerStatus = (appointmentStatus: string, assignedStaffId: string | null, currentUserId: string | null): Customer['status'] => {
  console.log('QueueContext - Mapping appointment status:', appointmentStatus, 'assigned to:', assignedStaffId, 'current user:', currentUserId);
  
  switch (appointmentStatus) {
    case 'checked_in':
      return 'waiting';
    case 'in_progress':
      // Only show as "serving" for the assigned staff member
      return assignedStaffId === currentUserId ? 'serving' : 'waiting';
    case 'completed':
      return 'served';
    case 'no_show':
      return 'no_show';
    default:
      return 'waiting';
  }
};

export const useQueueData = () => {
  const { user, role } = useAuth();
  
  const { data: appointmentsData = [] } = useQuery({
    queryKey: ['queue-appointments', user?.id],
    queryFn: async () => {
      // "Today" and the queue window are defined once in src/lib/dateRanges.ts so
      // this dashboard, /admin and /power-user count the same rows.
      const now = new Date();

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          scheduled_time,
          check_in_time,
          start_time,
          end_time,
          updated_at,
          created_at,
          notes,
          assigned_staff_id,
          customers!appointments_customer_id_fkey(first_name, last_name, phone, email),
          services!appointments_service_id_fkey(name)
        `)
        .or(todayMetricsOrFilter(now))
        .order('check_in_time', { ascending: true, nullsFirst: false })
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('QueueContext - Raw appointments data:', data);

      // Only people who have actually arrived (or been resolved today) belong in the
      // queue. A booking that is still 'scheduled' has not checked in yet — it used to
      // render as "Waiting -56 min" and inflate "Currently Waiting".
      //   waiting  = checked_in within the last 24 h (matches public_queue_snapshot)
      //   serving  = in_progress within the last 24 h
      //   served   = completed with end_time within the local day
      //   no_show  = no_show with updated_at within the local day
      const arrived = data.filter(appointment =>
        isWaitingNow(appointment, now) ||
        isInServiceNow(appointment, now) ||
        isServedToday(appointment, now) ||
        isNoShowToday(appointment, now)
      );

      // Transform database data to Customer interface
      const transformedCustomers = arrived.map(appointment => ({
        id: appointment.id,
        name: `${appointment.customers?.first_name || ''} ${appointment.customers?.last_name || ''}`.trim(),
        phone: appointment.customers?.phone,
        email: appointment.customers?.email,
        service: appointment.services?.name || 'Unknown Service',
        priority: 'normal' as const,
        status: mapAppointmentStatusToCustomerStatus(appointment.status, appointment.assigned_staff_id, user?.id || null),
        joinedAt: appointment.check_in_time ? new Date(appointment.check_in_time) : new Date(appointment.scheduled_time),
        calledAt: appointment.start_time ? new Date(appointment.start_time) : undefined,
        notes: appointment.notes,
        assignedStaffId: appointment.assigned_staff_id
      }));

      console.log('QueueContext - Transformed customers:', transformedCustomers);
      console.log('QueueContext - Customers with serving status:', transformedCustomers.filter(c => c.status === 'serving'));
      
      return transformedCustomers;
    },
    refetchInterval: 30000,
    enabled: !!user && ['staff', 'power_user', 'admin'].includes(role || '')
  });

  return { customers: appointmentsData || [] };
};
