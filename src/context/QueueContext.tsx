
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  service: string;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'serving' | 'served' | 'no_show';
  joinedAt: Date;
  calledAt?: Date;
  estimatedWaitTime?: number;
  notes?: string;
}

export interface QueueStats {
  totalCustomers: number;
  waitingCustomers: number;
  servedCustomers: number;
  noShowCustomers: number;
  averageWaitTime: number;
}

interface QueueContextType {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  stats: QueueStats;
  queueStatus: 'open' | 'closed';
  locationId: string;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => void;
  callNextCustomer: () => void;
  markAsServed: () => void;
  markAsNoShow: () => void;
  removeCustomer: (id: string) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  getQueuePosition: (customerId: string) => number;
  getEstimatedWaitTime: (customerId: string) => number;
  resetQueue: () => void;
  setQueueStatus: (status: 'open' | 'closed') => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState<'open' | 'closed'>('open');
  const [locationId] = useState('default-location');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch today's appointments from the database
  const { data: appointmentsData = [] } = useQuery({
    queryKey: ['queue-appointments'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          scheduled_time,
          check_in_time,
          start_time,
          end_time,
          notes,
          customers!inner(first_name, last_name, phone, email),
          services!inner(name)
        `)
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`)
        .order('check_in_time', { ascending: true, nullsFirst: false })
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      // Transform database data to Customer interface
      return data.map(appointment => ({
        id: appointment.id,
        name: `${appointment.customers.first_name} ${appointment.customers.last_name}`,
        phone: appointment.customers.phone,
        email: appointment.customers.email,
        service: appointment.services.name,
        priority: 'normal' as const, // Default priority
        status: mapAppointmentStatusToCustomerStatus(appointment.status),
        joinedAt: appointment.check_in_time ? new Date(appointment.check_in_time) : new Date(appointment.scheduled_time),
        calledAt: appointment.start_time ? new Date(appointment.start_time) : undefined,
        notes: appointment.notes
      }));
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Helper function to map appointment status to customer status
  const mapAppointmentStatusToCustomerStatus = (appointmentStatus: string): Customer['status'] => {
    switch (appointmentStatus) {
      case 'checked_in':
        return 'waiting';
      case 'in_progress':
        return 'serving';
      case 'completed':
        return 'served';
      case 'no_show':
        return 'no_show';
      default:
        return 'waiting';
    }
  };

  // Get customers from transformed appointments data
  const customers: Customer[] = appointmentsData || [];

  // Calculate stats from real data
  const stats: QueueStats = React.useMemo(() => {
    const totalCustomers = customers.length;
    const waitingCustomers = customers.filter(c => c.status === 'waiting').length;
    const servedCustomers = customers.filter(c => c.status === 'served').length;
    const noShowCustomers = customers.filter(c => c.status === 'no_show').length;
    
    // Calculate average wait time for served customers
    const servedWithWaitTime = customers.filter(c => c.status === 'served' && c.calledAt);
    const averageWaitTime = servedWithWaitTime.length > 0 
      ? servedWithWaitTime.reduce((acc, customer) => {
          if (customer.calledAt) {
            const waitTime = Math.floor((customer.calledAt.getTime() - customer.joinedAt.getTime()) / 60000);
            return acc + waitTime;
          }
          return acc;
        }, 0) / servedWithWaitTime.length
      : 0;

    console.log('QueueStats - Real data calculated:', {
      totalCustomers,
      waitingCustomers,
      servedCustomers,
      noShowCustomers,
      averageWaitTime
    });

    return {
      totalCustomers,
      waitingCustomers,
      servedCustomers,
      noShowCustomers,
      averageWaitTime
    };
  }, [customers]);

  // Find current customer being served
  useEffect(() => {
    const servingCustomer = customers.find(c => c.status === 'serving');
    setCurrentCustomer(servingCustomer || null);
  }, [customers]);

  const addCustomer = (customerData: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => {
    // This would need to create a new appointment in the database
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
      // Update appointment status to in_progress
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'in_progress',
          start_time: new Date().toISOString()
        })
        .eq('id', nextCustomer.id);

      if (error) throw error;

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      setIsLoading(false);
      toast({
        title: 'Customer Called',
        description: `${nextCustomer.name} is now being served`,
      });
    } catch (error) {
      console.error('Error calling next customer:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to call next customer',
        variant: 'destructive',
      });
    }
  };

  const markAsServed = async () => {
    if (!currentCustomer) return;

    setIsLoading(true);
    try {
      // Update appointment status to completed
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', currentCustomer.id);

      if (error) throw error;

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      setIsLoading(false);
      toast({
        title: 'Customer Served',
        description: `${currentCustomer.name} has been marked as served`,
      });
    } catch (error) {
      console.error('Error marking customer as served:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to mark customer as served',
        variant: 'destructive',
      });
    }
  };

  const markAsNoShow = async () => {
    if (!currentCustomer) return;

    setIsLoading(true);
    try {
      // Update appointment status to no_show
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'no_show' })
        .eq('id', currentCustomer.id);

      if (error) throw error;

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['queue-appointments'] });
      
      setIsLoading(false);
      toast({
        title: 'Marked as No-Show',
        description: `${currentCustomer.name} has been marked as no-show`,
      });
    } catch (error) {
      console.error('Error marking customer as no-show:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to mark customer as no-show',
        variant: 'destructive',
      });
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

  const getQueuePosition = (customerId: string) => {
    const waitingCustomers = customers
      .filter(c => c.status === 'waiting')
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority === 'priority' ? -1 : 1;
        }
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });
    
    const index = waitingCustomers.findIndex(c => c.id === customerId);
    return index === -1 ? -1 : index + 1;
  };

  const getEstimatedWaitTime = (customerId: string) => {
    const position = getQueuePosition(customerId);
    if (position === -1) return 0;
    
    const avgServiceTime = Math.max(stats.averageWaitTime || 15, 10);
    const estimatedWait = position * avgServiceTime;
    const bufferTime = currentCustomer ? 5 : 0;
    
    return estimatedWait + bufferTime;
  };

  const resetQueue = () => {
    toast({
      title: 'Feature Not Implemented',
      description: 'Resetting queue requires database operations',
      variant: 'destructive',
    });
  };

  return (
    <QueueContext.Provider value={{
      customers,
      currentCustomer,
      isLoading,
      stats,
      queueStatus,
      locationId,
      addCustomer,
      callNextCustomer,
      markAsServed,
      markAsNoShow,
      removeCustomer,
      updateCustomer,
      getQueuePosition,
      getEstimatedWaitTime,
      resetQueue,
      setQueueStatus
    }}>
      {children}
    </QueueContext.Provider>
  );
};
