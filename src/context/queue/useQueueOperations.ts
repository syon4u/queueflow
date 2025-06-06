
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Customer } from './types';

export const useQueueOperations = (customers: Customer[], currentCustomer: Customer | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const addCustomer = (customerData: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => {
    toast({
      title: 'Feature Not Implemented',
      description: 'Adding customers requires appointment creation in the database',
      variant: 'destructive',
    });
  };

  const callNextCustomer = async () => {
    if (currentCustomer) {
      toast({
        title: 'Customer Already Being Served',
        description: 'Please complete the current customer before calling the next one.',
        variant: 'destructive',
      });
      return;
    }

    const waitingCustomers = customers
      .filter(c => c.status === 'waiting')
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority === 'priority' ? -1 : 1;
        }
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });

    if (waitingCustomers.length === 0) {
      toast({
        title: 'No Customers Waiting',
        description: 'The queue is currently empty.',
      });
      return;
    }

    setIsLoading(true);
    const nextCustomer = waitingCustomers[0];

    try {
      console.log('Calling next customer:', nextCustomer.id);
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'in_progress',
          start_time: new Date().toISOString(),
          staff_id: user?.id
        })
        .eq('id', nextCustomer.id);

      if (error) {
        console.error('Error calling next customer:', error);
        throw error;
      }

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
        description: 'Failed to call next customer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsServed = async () => {
    if (!currentCustomer) {
      toast({
        title: 'No Customer Being Served',
        description: 'No customer is currently being served.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Marking customer as served:', currentCustomer.id);
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', currentCustomer.id)
        .eq('status', 'in_progress');

      if (error) {
        console.error('Database error marking customer as served:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      await queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      console.log('Successfully marked customer as served');
      toast({
        title: 'Customer Served',
        description: `${currentCustomer.name} has been marked as served`,
      });
    } catch (error) {
      console.error('Error marking customer as served:', error);
      toast({
        title: 'Error',
        description: `Failed to mark customer as served: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsNoShow = async () => {
    if (!currentCustomer) {
      toast({
        title: 'No Customer Being Served',
        description: 'No customer is currently being served.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Marking customer as no-show:', currentCustomer.id);
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'no_show',
          end_time: new Date().toISOString()
        })
        .eq('id', currentCustomer.id)
        .in('status', ['checked_in', 'in_progress']);

      if (error) {
        console.error('Database error marking customer as no-show:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      await queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      console.log('Successfully marked customer as no-show');
      toast({
        title: 'Marked as No-Show',
        description: `${currentCustomer.name} has been marked as no-show`,
      });
    } catch (error) {
      console.error('Error marking customer as no-show:', error);
      toast({
        title: 'Error',
        description: `Failed to mark customer as no-show: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    addCustomer,
    callNextCustomer,
    markAsServed,
    markAsNoShow,
    removeCustomer,
    updateCustomer,
    resetQueue
  };
};
