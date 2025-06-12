
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/MinimalAuthContext';
import { useStaffActions } from '@/hooks/use-staff-actions';
import { Customer } from './types';

export const useQueueOperations = (customers: Customer[], currentCustomer: Customer | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCallRequest, setPendingCallRequest] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { logAction } = useStaffActions();

  const addCustomer = (customerData: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => {
    toast({
      title: 'Feature Not Implemented',
      description: 'Adding customers requires appointment creation in the database',
      variant: 'destructive',
    });
  };

  const callNextCustomer = async () => {
    if (!user) {
      toast({
        title: 'Not Available',
        description: 'Authentication required for queue operations.',
        variant: 'destructive'
      });
      return;
    }

    // Check if staff member already has a customer
    if (currentCustomer) {
      // Queue the request instead of blocking
      setPendingCallRequest(true);
      toast({
        title: 'Request Queued',
        description: 'Your request to call the next customer has been queued. Complete your current customer first.',
        variant: 'default'
      });
      return;
    }

    // Check staff availability - skip if no user
    if (user?.id) {
      const { data: staffProfile } = await supabase
        .from('profiles')
        .select('availability_status')
        .eq('id', user.id)
        .single();

      if (staffProfile?.availability_status !== 'available') {
        toast({
          title: 'Not Available',
          description: 'You must be marked as available to serve customers.',
          variant: 'destructive'
        });
        return;
      }
    }

    const waitingCustomers = customers
      .filter(c => c.status === 'waiting')
      .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime()); // Sort by check-in time

    if (waitingCustomers.length === 0) {
      toast({
        title: 'No Customers Waiting',
        description: 'The queue is currently empty.',
      });
      return;
    }

    setIsLoading(true);
    const nextCustomer = waitingCustomers[0];
    let retryCount = 0;
    const maxRetries = 2;

    const attemptCall = async (): Promise<void> => {
      try {
        console.log('Calling next customer:', nextCustomer.id);
        
        // Get current appointment data for logging
        const { data: currentData } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', nextCustomer.id)
          .single();

        const { error } = await supabase
          .from('appointments')
          .update({ 
            status: 'in_progress',
            start_time: new Date().toISOString(),
            assigned_staff_id: user?.id || null
          })
          .eq('id', nextCustomer.id)
          .eq('status', 'checked_in'); // Ensure customer is still checked in

        if (error) {
          console.error('Error calling next customer:', error);
          throw error;
        }

        // Log the action for undo functionality - only if user exists
        if (user?.id) {
          await logAction(
            'call_customer',
            'appointment',
            nextCustomer.id,
            currentData,
            { 
              status: 'in_progress',
              start_time: new Date().toISOString(),
              assigned_staff_id: user.id
            }
          );
        }

        // Create notification for other staff - only if user exists
        if (user?.id) {
          await supabase
            .from('staff_notification_queue')
            .insert({
              staff_id: user.id,
              type: 'customer_called',
              title: 'Customer Called',
              message: `${nextCustomer.name} is now being served`,
              data: { customer_id: nextCustomer.id, customer_name: nextCustomer.name }
            });
        }

      } catch (error) {
        console.error(`Call attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptCall();
        }
        
        throw error;
      }
    };

    try {
      await attemptCall();
      
      queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      console.log('Successfully called next customer');
      toast({
        title: 'Customer Called',
        description: `${nextCustomer.name} is now being served`,
      });
    } catch (error) {
      console.error('Error calling next customer:', error);
      toast({
        title: 'Error',
        description: `Failed to call next customer after ${maxRetries} attempts. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsServed = async () => {
    if (!currentCustomer || !user) {
      toast({
        title: 'No Customer Being Served',
        description: 'No customer is currently being served.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;

    const attemptMarkServed = async (): Promise<void> => {
      try {
        console.log('Marking customer as served:', currentCustomer.id);
        
        // Get current appointment data for logging
        const { data: currentData } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', currentCustomer.id)
          .single();

        const { error } = await supabase
          .from('appointments')
          .update({ 
            status: 'completed',
            end_time: new Date().toISOString()
          })
          .eq('id', currentCustomer.id)
          .eq('assigned_staff_id', user?.id || null)
          .eq('status', 'in_progress');

        if (error) {
          console.error('Database error marking customer as served:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        // Log the action for undo functionality - only if user exists
        if (user?.id) {
          await logAction(
            'mark_served',
            'appointment',
            currentCustomer.id,
            currentData,
            { 
              status: 'completed',
              end_time: new Date().toISOString()
            }
          );
        }

      } catch (error) {
        console.error(`Mark served attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptMarkServed();
        }
        
        throw error;
      }
    };

    try {
      await attemptMarkServed();
      
      await queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      console.log('Successfully marked customer as served');
      toast({
        title: 'Customer Served',
        description: `${currentCustomer.name} has been marked as served`,
      });

      // If there was a pending call request, process it now
      if (pendingCallRequest) {
        setPendingCallRequest(false);
        setTimeout(() => callNextCustomer(), 1000); // Small delay to allow UI to update
      }
      
    } catch (error) {
      console.error('Error marking customer as served:', error);
      toast({
        title: 'Error',
        description: `Failed to mark customer as served after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsNoShow = async () => {
    if (!currentCustomer || !user) {
      toast({
        title: 'No Customer Being Served',
        description: 'No customer is currently being served.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;

    const attemptMarkNoShow = async (): Promise<void> => {
      try {
        console.log('Marking customer as no-show:', currentCustomer.id);
        
        // Get current appointment data for logging
        const { data: currentData } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', currentCustomer.id)
          .single();

        const { error } = await supabase
          .from('appointments')
          .update({ 
            status: 'no_show',
            end_time: new Date().toISOString()
          })
          .eq('id', currentCustomer.id)
          .eq('assigned_staff_id', user?.id || null)
          .in('status', ['checked_in', 'in_progress']);

        if (error) {
          console.error('Database error marking customer as no-show:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        // Log the action for undo functionality - only if user exists
        if (user?.id) {
          await logAction(
            'mark_no_show',
            'appointment',
            currentCustomer.id,
            currentData,
            { 
              status: 'no_show',
              end_time: new Date().toISOString()
            }
          );
        }

      } catch (error) {
        console.error(`Mark no-show attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptMarkNoShow();
        }
        
        throw error;
      }
    };

    try {
      await attemptMarkNoShow();
      
      await queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      console.log('Successfully marked customer as no-show');
      toast({
        title: 'Marked as No-Show',
        description: `${currentCustomer.name} has been marked as no-show`,
      });

      // If there was a pending call request, process it now
      if (pendingCallRequest) {
        setPendingCallRequest(false);
        setTimeout(() => callNextCustomer(), 1000);
      }
      
    } catch (error) {
      console.error('Error marking customer as no-show:', error);
      toast({
        title: 'Error',
        description: `Failed to mark customer as no-show after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCustomer = (id: string) => {
    toast({
      title: 'Feature Not Implemented',
      description: 'Removing customers requires database operations',
      variant: 'destructive',
    });
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    toast({
      title: 'Feature Not Implemented',
      description: 'Updating customers requires database operations',
      variant: 'destructive',
    });
  };

  const resetQueue = () => {
    toast({
      title: 'Feature Not Implemented',
      description: 'Resetting queue requires database operations',
      variant: 'destructive',
    });
  };

  return {
    isLoading,
    pendingCallRequest,
    addCustomer,
    callNextCustomer,
    markAsServed,
    markAsNoShow,
    removeCustomer,
    updateCustomer,
    resetQueue
  };
};
