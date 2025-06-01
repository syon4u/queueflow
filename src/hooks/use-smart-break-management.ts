import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BreakRequest {
  id: string;
  staffId: string;
  breakType: 'short' | 'lunch' | 'meeting' | 'training' | 'emergency';
  duration: number;
  requestedTime: Date;
  status: 'pending' | 'approved' | 'denied' | 'active' | 'completed';
  handoverStaffId?: string;
  reason?: string;
  autoApproved: boolean;
}

export interface StaffAvailability {
  staffId: string;
  name: string;
  currentWorkload: number;
  status: 'available' | 'busy' | 'break' | 'offline';
  canCover: boolean;
}

const mapStatusToUnionType = (status: string | null): 'available' | 'busy' | 'break' | 'offline' => {
  switch (status) {
    case 'available':
    case 'active':
      return 'available';
    case 'busy':
      return 'busy';
    case 'break':
      return 'break';
    case 'offline':
    case 'inactive':
      return 'offline';
    default:
      return 'offline';
  }
};

export const useSmartBreakManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentBreak, setCurrentBreak] = useState<BreakRequest | null>(null);
  const [availableStaff, setAvailableStaff] = useState<StaffAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkStaffAvailability = async () => {
    try {
      const { data: staff, error } = await supabase
        .from('staff')
        .select('id, first_name, last_name, status, location_id')
        .neq('id', user?.id)
        .eq('location_id', user?.id); // Assuming user has location context

      if (error) throw error;

      // Get current workload for each staff member
      const staffWithWorkload = await Promise.all(
        (staff || []).map(async (s) => {
          const { data: workload } = await supabase
            .from('appointments')
            .select('id')
            .eq('staff_id', s.id)
            .in('status', ['checked_in', 'in_progress']);

          const mappedStatus = mapStatusToUnionType(s.status);

          return {
            staffId: s.id,
            name: `${s.first_name} ${s.last_name}`,
            currentWorkload: workload?.length || 0,
            status: mappedStatus,
            canCover: mappedStatus === 'available' && (workload?.length || 0) < 3
          };
        })
      );

      setAvailableStaff(staffWithWorkload);
    } catch (error) {
      console.error('Error checking staff availability:', error);
    }
  };

  const requestBreak = async (
    breakType: BreakRequest['breakType'],
    duration: number,
    handoverStaffId?: string,
    reason?: string
  ): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Check if auto-approval is possible
      const lowWorkload = availableStaff.some(s => s.canCover);
      const isShortBreak = breakType === 'short' && duration <= 15;
      const autoApproved = lowWorkload && isShortBreak;

      const breakRequest: Omit<BreakRequest, 'id'> = {
        staffId: user.id,
        breakType,
        duration,
        requestedTime: new Date(),
        status: autoApproved ? 'approved' : 'pending',
        handoverStaffId,
        reason,
        autoApproved
      };

      // In a real implementation, this would go to the database
      // For now, we'll simulate the process
      const newBreak: BreakRequest = {
        ...breakRequest,
        id: `break-${Date.now()}`
      };

      if (autoApproved) {
        await startBreak(newBreak);
      } else {
        // Send notification to supervisor for approval
        await supabase
          .from('staff_notifications')
          .insert({
            staff_id: 'supervisor-id', // Would be determined by location/hierarchy
            type: 'break_request',
            message: `${user.email} requested a ${duration}-minute ${breakType} break`,
            status: 'unread'
          });

        toast({
          title: 'Break Request Submitted',
          description: 'Your break request has been sent for approval'
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting break:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit break request'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const startBreak = async (breakRequest: BreakRequest) => {
    try {
      // Update staff status
      await supabase
        .from('staff')
        .update({ 
          status: 'break',
          return_time: new Date(Date.now() + breakRequest.duration * 60000).toISOString(),
          handover_staff_id: breakRequest.handoverStaffId
        })
        .eq('id', user?.id);

      // Notify handover staff if applicable
      if (breakRequest.handoverStaffId) {
        await supabase
          .from('staff_notifications')
          .insert({
            staff_id: breakRequest.handoverStaffId,
            type: 'handover_request',
            message: `Please take over for ${user?.email} who is on a ${breakRequest.duration}-minute break`,
            status: 'unread'
          });
      }

      setCurrentBreak({ ...breakRequest, status: 'active' });

      toast({
        title: 'Break Started',
        description: `Your ${breakRequest.duration}-minute break has begun`
      });

      // Auto-return from break
      setTimeout(() => {
        endBreak();
      }, breakRequest.duration * 60000);

    } catch (error) {
      console.error('Error starting break:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start break'
      });
    }
  };

  const endBreak = async () => {
    if (!currentBreak || !user) return;

    try {
      await supabase
        .from('staff')
        .update({ 
          status: 'active',
          return_time: null,
          handover_staff_id: null
        })
        .eq('id', user.id);

      // Notify handover staff that break is over
      if (currentBreak.handoverStaffId) {
        await supabase
          .from('staff_notifications')
          .insert({
            staff_id: currentBreak.handoverStaffId,
            type: 'handover_complete',
            message: `${user.email} has returned from break`,
            status: 'unread'
          });
      }

      setCurrentBreak(null);

      toast({
        title: 'Welcome Back',
        description: 'Your break has ended. You are now active.'
      });

    } catch (error) {
      console.error('Error ending break:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to end break'
      });
    }
  };

  useEffect(() => {
    checkStaffAvailability();
  }, [user]);

  return {
    currentBreak,
    availableStaff,
    isLoading,
    requestBreak,
    endBreak,
    refreshStaffAvailability: checkStaffAvailability
  };
};
