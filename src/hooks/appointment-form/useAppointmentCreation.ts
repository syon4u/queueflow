import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppointmentFormData } from '@/components/customer/appointment-scheduling/AppointmentForm';
import { useCapacityCheck } from '@/hooks/use-capacity-check';
import { useCapacityManagement } from '@/hooks/use-capacity-management';

export function useAppointmentCreation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addToWaitlist } = useCapacityManagement();

  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: { first_name: string; last_name: string; phone: string; email?: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) {
        console.error('Customer creation error:', error);
        throw new Error(error.message || 'Failed to create customer');
      }
      return data;
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: AppointmentFormData) => {
      console.log('Creating appointment with data:', appointmentData);

      // Check capacity before creating appointment
      const { data: capacityCheck, error: capacityError } = await supabase.rpc('check_location_capacity', {
        location_uuid: appointmentData.location_id
      });

      if (capacityError) {
        console.error('Capacity check error:', capacityError);
        throw new Error('Failed to check location capacity');
      }

      // If no capacity available, offer waitlist
      if (!capacityCheck.has_capacity) {
        throw new Error('CAPACITY_FULL');
      }

      // Proceed with appointment creation if capacity is available
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            customer_id: appointmentData.customer_id,
            service_id: appointmentData.service_id,
            location_id: appointmentData.location_id,
            scheduled_time: appointmentData.scheduled_time,
            notes: appointmentData.notes,
            reason_for_visit: appointmentData.reason_for_visit,
            status: 'scheduled',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Appointment creation error:', error);
        throw new Error(error.message || 'Failed to create appointment');
      }
      return data;
    },
    onSuccess: (data) => {
      console.log('Appointment created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['capacity-status'] });
      toast({
        title: "Success!",
        description: "Your appointment has been scheduled successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Appointment creation error:', error);
      
      if (error.message === 'CAPACITY_FULL') {
        // Handle capacity full scenario in the component
        throw error;
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create appointment. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: { id: string; notes: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ notes: appointmentData.notes })
        .eq('id', appointmentData.id)
        .select()
        .single();

      if (error) {
        console.error('Appointment update error:', error);
        throw new Error(error.message || 'Failed to update appointment');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Success!",
        description: "Appointment updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Appointment update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) {
        console.error('Appointment cancellation error:', error);
        throw new Error(error.message || 'Failed to cancel appointment');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Success!",
        description: "Appointment cancelled successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Appointment cancellation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    createCustomer: createCustomerMutation.mutateAsync,
    isCreatingCustomer: createCustomerMutation.isLoading,
    createAppointment: createAppointmentMutation.mutateAsync,
    isCreatingAppointment: createAppointmentMutation.isLoading,
    updateAppointment: updateAppointmentMutation.mutateAsync,
    isUpdatingAppointment: updateAppointmentMutation.isLoading,
    cancelAppointment: cancelAppointmentMutation.mutateAsync,
    isCancellingAppointment: cancelAppointmentMutation.isLoading,
  };
}
