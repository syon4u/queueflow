
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMinimalAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

type AppointmentStatus = 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

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
    newStatus: AppointmentStatus,
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

      // Update appointment with proper typing
      const updateData: Record<string, any> = {
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

  const getRecentActions = async (limit: number = 10) => {
    if (!user?.id) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('staff_actions')
        .select('*')
        .eq('staff_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent actions:', error);
      return [];
    }
  };

  const undoAction = async (actionId: string) => {
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
      // Get the action to undo
      const { data: action, error: fetchError } = await supabase
        .from('staff_actions')
        .select('*')
        .eq('id', actionId)
        .single();

      if (fetchError) throw fetchError;

      if (action.resource_type === 'appointment') {
        // Undo appointment changes
        const { error: undoError } = await supabase
          .from('appointments')
          .update(action.old_data)
          .eq('id', action.resource_id);

        if (undoError) throw undoError;
      }

      // Log the undo action
      await logAction(
        'undo_action',
        action.resource_type,
        action.resource_id,
        action.new_data,
        action.old_data
      );

      toast({
        title: 'Success',
        description: 'Action has been undone',
      });

      return true;
    } catch (error: any) {
      console.error('Error undoing action:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to undo action',
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
    getRecentActions,
    undoAction,
    isLoading,
  };
};
