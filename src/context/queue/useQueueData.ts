
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/MinimalAuthContext';
import { Customer } from './types';

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
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          scheduled_time,
          check_in_time,
          start_time,
          end_time,
          notes,
          assigned_staff_id,
          customers!appointments_customer_id_fkey(first_name, last_name, phone, email),
          services!appointments_service_id_fkey(name)
        `)
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`)
        .order('check_in_time', { ascending: true, nullsFirst: false })
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('QueueContext - Raw appointments data:', data);

      // Transform database data to Customer interface
      const transformedCustomers = data.map(appointment => ({
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
    // Always enabled since auth is disabled
    enabled: true
  });

  return { customers: appointmentsData || [] };
};
