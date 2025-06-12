
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMinimalAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const useStaffActions = () => {
  const { user } = useMinimalAuth();
  const [isLoading, setIsLoading] = useState(false);

  const logAction = async (
    actionType: string,
    resourceType: string,
    resourceId: string,
    oldData?: any,
    newData?: any
  ) => {
    if (!user?.id) {
      console.warn('No user ID available for logging action');
      return;
    }

    try {
      await supabase.from('staff_actions').insert({
        staff_id: user.id,
        action_type: actionType,
        resource_type: resourceType,
        resource_id: resourceId,
        old_data: oldData,
        new_data: newData,
      });
    } catch (error) {
      console.error('Failed to log staff action:', error);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    newStatus: string,
    additionalData?: Record<string, any>
  ) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to perform this action',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Get current appointment data for logging
      const { data: currentData } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      // Update appointment
      const updateData = {
        status: newStatus,
        ...additionalData,
      };

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId);

      if (error) throw error;

      // Log the action
      await logAction(
        'update_appointment_status',
        'appointment',
        appointmentId,
        currentData,
        { ...currentData, ...updateData }
      );

      toast({
        title: 'Success',
        description: `Appointment status updated to ${newStatus}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error updating appointment status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update appointment status',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateAppointmentStatus,
    logAction,
    isLoading,
  };
};
