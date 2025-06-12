
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/MinimalAuthContext';

interface StaffAction {
  id: string;
  action_type: string;
  resource_type: string;
  resource_id: string;
  old_data: any;
  new_data: any;
  created_at: string;
  can_undo: boolean;
  undone_at: string | null;
}

export const useStaffActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const logAction = async (
    actionType: string,
    resourceType: string,
    resourceId: string,
    oldData: any,
    newData: any
  ) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('staff_actions')
        .insert({
          staff_id: user.id,
          action_type: actionType,
          resource_type: resourceType,
          resource_id: resourceId,
          old_data: oldData,
          new_data: newData
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging staff action:', error);
    }
  };

  const getRecentActions = async (limit = 10) => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('staff_actions')
        .select('*')
        .eq('staff_id', user.id)
        .eq('can_undo', true)
        .is('undone_at', null)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
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
    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;

    const attemptUndo = async (): Promise<boolean> => {
      try {
        // Get the action details
        const { data: action, error: fetchError } = await supabase
          .from('staff_actions')
          .select('*')
          .eq('id', actionId)
          .single();

        if (fetchError) throw fetchError;

        if (!action || action.undone_at) {
          throw new Error('Action not found or already undone');
        }

        // Perform the undo based on resource type
        if (action.resource_type === 'appointment') {
          const { error: undoError } = await supabase
            .from('appointments')
            .update(action.old_data as any)
            .eq('id', action.resource_id);

          if (undoError) throw undoError;
        }

        // Mark action as undone
        const { error: markError } = await supabase
          .from('staff_actions')
          .update({ undone_at: new Date().toISOString() })
          .eq('id', actionId);

        if (markError) throw markError;

        return true;
      } catch (error) {
        console.error(`Undo attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          return attemptUndo();
        }
        
        throw error;
      }
    };

    try {
      await attemptUndo();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      toast({
        title: 'Action Undone',
        description: 'The last action has been successfully undone.'
      });
    } catch (error) {
      toast({
        title: 'Undo Failed',
        description: `Failed to undo action after ${maxRetries} attempts. Please try again.`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logAction,
    getRecentActions,
    undoAction,
    isLoading
  };
};
