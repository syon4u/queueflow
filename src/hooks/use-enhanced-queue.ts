
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface EnhancedCustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  service: string;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'called' | 'serving' | 'served' | 'no_show';
  joinedAt: Date;
  calledAt?: Date;
  servedAt?: Date;
  estimatedWaitTime?: number;
  actualWaitTime?: number;
  notes?: string;
  position?: number;
}

export interface QueueSettings {
  autoCallEnabled: boolean;
  autoCallInterval: number;
  soundEnabled: boolean;
  estimatedWaitPerCustomer: number;
  maxWaitTime: number;
}

export const useEnhancedQueue = (locationId?: string) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [customers, setCustomers] = useState<EnhancedCustomer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<EnhancedCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<QueueSettings>({
    autoCallEnabled: false,
    autoCallInterval: 30,
    soundEnabled: true,
    estimatedWaitPerCustomer: 15,
    maxWaitTime: 120
  });
  
  const autoCallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications
  useEffect(() => {
    if (settings.soundEnabled) {
      audioRef.current = new Audio('/notification.mp3'); // You'd need to add this sound file
    }
  }, [settings.soundEnabled]);

  // Real-time subscription for queue updates
  useEffect(() => {
    if (!locationId) return;

    const channel = supabase
      .channel(`queue-${locationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `location_id=eq.${locationId}`
        },
        (payload) => {
          console.log('Queue update received:', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [locationId]);

  // Auto-call functionality
  useEffect(() => {
    if (settings.autoCallEnabled && !currentCustomer) {
      autoCallTimeoutRef.current = setTimeout(() => {
        callNextCustomer();
      }, settings.autoCallInterval * 1000);
    }

    return () => {
      if (autoCallTimeoutRef.current) {
        clearTimeout(autoCallTimeoutRef.current);
      }
    };
  }, [settings.autoCallEnabled, settings.autoCallInterval, currentCustomer]);

  const handleRealtimeUpdate = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        if (newRecord.status === 'checked_in') {
          addCustomerToQueue(newRecord);
        }
        break;
      case 'UPDATE':
        updateCustomerInQueue(newRecord, oldRecord);
        break;
      case 'DELETE':
        removeCustomerFromQueue(oldRecord.id);
        break;
    }
  }, []);

  const addCustomerToQueue = useCallback((appointmentData: any) => {
    const newCustomer: EnhancedCustomer = {
      id: appointmentData.id,
      name: appointmentData.customer_id, // This would need proper customer name resolution
      service: appointmentData.service_id,
      priority: 'normal',
      status: 'waiting',
      joinedAt: new Date(appointmentData.check_in_time || appointmentData.created_at),
      estimatedWaitTime: calculateEstimatedWaitTime()
    };

    setCustomers(prev => {
      const updated = [...prev, newCustomer];
      return sortCustomersByPriority(updated);
    });

    toast({
      title: t('queue.customerAdded'),
      description: `${newCustomer.name} joined the queue`,
    });
  }, [settings.estimatedWaitPerCustomer, t, toast]);

  const updateCustomerInQueue = useCallback((newData: any, oldData: any) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === newData.id 
          ? { 
              ...customer, 
              status: mapAppointmentStatusToQueueStatus(newData.status),
              calledAt: newData.start_time ? new Date(newData.start_time) : customer.calledAt,
              servedAt: newData.end_time ? new Date(newData.end_time) : customer.servedAt
            }
          : customer
      )
    );
  }, []);

  const removeCustomerFromQueue = useCallback((customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    if (currentCustomer?.id === customerId) {
      setCurrentCustomer(null);
    }
  }, [currentCustomer]);

  const calculateEstimatedWaitTime = useCallback(() => {
    const waitingCount = customers.filter(c => c.status === 'waiting').length;
    return waitingCount * settings.estimatedWaitPerCustomer;
  }, [customers, settings.estimatedWaitPerCustomer]);

  const sortCustomersByPriority = useCallback((customerList: EnhancedCustomer[]) => {
    return customerList.sort((a, b) => {
      // Priority customers first
      if (a.priority !== b.priority) {
        return a.priority === 'priority' ? -1 : 1;
      }
      // Then by join time
      return a.joinedAt.getTime() - b.joinedAt.getTime();
    });
  }, []);

  const callNextCustomer = useCallback(async () => {
    const waitingCustomers = customers.filter(c => c.status === 'waiting');
    const sortedCustomers = sortCustomersByPriority(waitingCustomers);
    
    if (sortedCustomers.length === 0) {
      toast({
        title: t('queue.noCustomersWaiting'),
        description: t('queue.queueEmpty'),
      });
      return;
    }

    const nextCustomer = sortedCustomers[0];
    setIsLoading(true);

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

      // Update local state
      setCurrentCustomer({
        ...nextCustomer,
        status: 'serving',
        calledAt: new Date()
      });

      setCustomers(prev => 
        prev.map(c => 
          c.id === nextCustomer.id 
            ? { ...c, status: 'called', calledAt: new Date() }
            : c
        )
      );

      // Play sound notification
      if (settings.soundEnabled && audioRef.current) {
        audioRef.current.play().catch(console.error);
      }

      toast({
        title: t('queue.customerCalled'),
        description: `${nextCustomer.name} - ${nextCustomer.service}`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Error calling customer:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.callError'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [customers, settings.soundEnabled, sortCustomersByPriority, t, toast]);

  const markAsServed = useCallback(async () => {
    if (!currentCustomer) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', currentCustomer.id);

      if (error) throw error;

      setCurrentCustomer(null);
      setCustomers(prev => 
        prev.map(c => 
          c.id === currentCustomer.id 
            ? { 
                ...c, 
                status: 'served', 
                servedAt: new Date(),
                actualWaitTime: Math.floor((new Date().getTime() - c.joinedAt.getTime()) / 60000)
              }
            : c
        )
      );

      toast({
        title: t('queue.customerServed'),
        description: currentCustomer.name,
      });

    } catch (error) {
      console.error('Error marking as served:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.serveError'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentCustomer, t, toast]);

  const markAsNoShow = useCallback(async () => {
    if (!currentCustomer) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'no_show' })
        .eq('id', currentCustomer.id);

      if (error) throw error;

      setCurrentCustomer(null);
      setCustomers(prev => 
        prev.map(c => 
          c.id === currentCustomer.id 
            ? { ...c, status: 'no_show' }
            : c
        )
      );

      toast({
        title: t('queue.markedNoShow'),
        description: currentCustomer.name,
      });

    } catch (error) {
      console.error('Error marking no-show:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.noShowError'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentCustomer, t, toast]);

  const updateSettings = useCallback((newSettings: Partial<QueueSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Helper function to map appointment status to queue status
  const mapAppointmentStatusToQueueStatus = (appointmentStatus: string) => {
    switch (appointmentStatus) {
      case 'checked_in': return 'waiting';
      case 'in_progress': return 'serving';
      case 'completed': return 'served';
      case 'no_show': return 'no_show';
      default: return 'waiting';
    }
  };

  // Calculate queue statistics
  const stats = {
    totalCustomers: customers.length,
    waitingCustomers: customers.filter(c => c.status === 'waiting').length,
    servedCustomers: customers.filter(c => c.status === 'served').length,
    noShowCustomers: customers.filter(c => c.status === 'no_show').length,
    averageWaitTime: customers
      .filter(c => c.actualWaitTime)
      .reduce((acc, c) => acc + (c.actualWaitTime || 0), 0) / 
      customers.filter(c => c.actualWaitTime).length || 0
  };

  return {
    customers: sortCustomersByPriority(customers),
    currentCustomer,
    isLoading,
    settings,
    stats,
    callNextCustomer,
    markAsServed,
    markAsNoShow,
    updateSettings,
    refreshQueue: () => window.location.reload() // Simple refresh for now
  };
};
