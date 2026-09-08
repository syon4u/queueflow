
import { useState } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export type AvailabilityStatus = 'available' | 'unavailable' | 'on_break' | 'in_meeting';

export const useStaffAvailability = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get current staff availability status
  const { data: currentStatus, isLoading } = useQuery({
    queryKey: ['staff-availability', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('availability_status, unavailable_reason, unavailable_since')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const updateAvailability = async (
    status: AvailabilityStatus, 
    reason?: string
  ) => {
    if (!user) return;

    setIsUpdating(true);
    let retryCount = 0;
    const maxRetries = 2;

    const attemptUpdate = async (): Promise<void> => {
      try {
        const updateData: Database['public']['Tables']['profiles']['Update'] = {
          availability_status: status,
          unavailable_reason: status === 'available' ? null : reason,
          unavailable_since: status === 'available' ? null : new Date().toISOString()
        };

        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);

        if (error) throw error;

        // Create notification for other staff members
        if (status !== 'available') {
          await supabase
            .from('staff_notification_queue')
            .insert({
              staff_id: user.id,
              type: 'staff_unavailable',
              title: 'Staff Unavailable',
              message: `Staff member is now ${status}${reason ? `: ${reason}` : ''}`,
              data: { status, reason }
            });
        }

      } catch (error) {
        console.error(`Availability update attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptUpdate();
        }
        
        throw error;
      }
    };

    try {
      await attemptUpdate();
      
      queryClient.invalidateQueries({ queryKey: ['staff-availability'] });
      
      toast({
        title: 'Status Updated',
        description: `You are now marked as ${status}${reason ? `: ${reason}` : ''}`
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: `Failed to update availability after ${maxRetries} attempts.`,
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentAssignment = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          customers!appointments_customer_id_fkey(first_name, last_name),
          services!appointments_service_id_fkey(name)
        `)
        .eq('assigned_staff_id', user.id)
        .eq('status', 'in_progress')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching current assignment:', error);
      return null;
    }
  };

  return {
    currentStatus: currentStatus?.availability_status || 'available',
    unavailableReason: currentStatus?.unavailable_reason,
    unavailableSince: currentStatus?.unavailable_since,
    isLoading,
    isUpdating,
    updateAvailability,
    getCurrentAssignment
  };
};
