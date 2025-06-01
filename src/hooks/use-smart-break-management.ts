
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BreakRequest, StaffAvailability } from '@/types/break-management';
import { checkStaffAvailability } from '@/services/staff-availability';
import { 
  createBreakRequest, 
  startBreak, 
  endBreak, 
  sendBreakApprovalRequest 
} from '@/services/break-operations';

export const useSmartBreakManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentBreak, setCurrentBreak] = useState<BreakRequest | null>(null);
  const [availableStaff, setAvailableStaff] = useState<StaffAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStaffAvailability = async () => {
    try {
      const staff = await checkStaffAvailability(user?.id);
      setAvailableStaff(staff);
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
      const breakRequest = await createBreakRequest(
        user.id,
        breakType,
        duration,
        availableStaff,
        handoverStaffId,
        reason
      );

      if (breakRequest.autoApproved) {
        await startBreak(breakRequest, user.email);
        await handleStartBreak(breakRequest);
      } else {
        await sendBreakApprovalRequest('supervisor-id', user.email, duration, breakType);
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

  const handleStartBreak = async (breakRequest: BreakRequest) => {
    try {
      setCurrentBreak({ ...breakRequest, status: 'active' });

      toast({
        title: 'Break Started',
        description: `Your ${breakRequest.duration}-minute break has begun`
      });

      // Auto-return from break
      setTimeout(() => {
        handleEndBreak();
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

  const handleEndBreak = async () => {
    if (!currentBreak || !user) return;

    try {
      await endBreak(currentBreak, user.email);
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
    refreshStaffAvailability();
  }, [user]);

  return {
    currentBreak,
    availableStaff,
    isLoading,
    requestBreak,
    endBreak: handleEndBreak,
    refreshStaffAvailability
  };
};
