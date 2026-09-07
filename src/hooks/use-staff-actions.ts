
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

type AppointmentStatus = 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export const useStaffActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const logAction = async (
    actionType: string,
    resourceType: string,
    resourceId: string,
    oldData?: any,
    newData?: any,
    options: { canUndo?: boolean } = {}
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
        can_undo: options.canUndo ?? true,
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

  // Only actions that can still be undone: can_undo = true and not yet undone.
  // Stable identity (useCallback) so UndoActionButton's effect does not re-run
  // on every render.
  const userId = user?.id;
  const getRecentActions = useCallback(async (limit: number = 10) => {
    if (!userId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('staff_actions')
        .select('*')
        .eq('staff_id', userId)
        .eq('can_undo', true)
        .is('undone_at', null)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent actions:', error);
      return [];
    }
  }, [userId]);

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

      if (action.undone_at || action.can_undo === false) {
        toast({
          title: 'Nothing to undo',
          description: 'This action has already been undone',
        });
        return false;
      }

      if (action.resource_type === 'appointment' && action.old_data) {
        // Type cast the JSON data to the expected appointment update format
        const oldAppointmentData = action.old_data as Record<string, any>;
        
        // Extract only the fields we want to update (excluding id and other system fields)
        const updateFields: Record<string, any> = {};
        const allowedFields = [
          'status', 'scheduled_time', 'check_in_time', 'start_time', 'end_time',
          'notes', 'reason_for_visit', 'staff_id', 'assigned_staff_id'
        ];
        
        allowedFields.forEach(field => {
          if (oldAppointmentData[field] !== undefined) {
            updateFields[field] = oldAppointmentData[field];
          }
        });

        // Undo appointment changes
        const { error: undoError } = await supabase
          .from('appointments')
          .update(updateFields)
          .eq('id', action.resource_id);

        if (undoError) throw undoError;
      }

      // Mark the original as undone so it is not offered again (F38).
      const { error: markError } = await supabase
        .from('staff_actions')
        .update({ undone_at: new Date().toISOString(), can_undo: false })
        .eq('id', actionId);

      if (markError) throw markError;

      // Log the undo itself as a non-undoable action.
      await logAction(
        'undo_action',
        action.resource_type,
        action.resource_id,
        action.new_data,
        action.old_data,
        { canUndo: false }
      );

      // Refresh the queue dashboard now instead of waiting for the 30 s poll.
      await queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });

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
