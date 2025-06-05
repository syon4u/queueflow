
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QueuePosition {
  id: string;
  customer_id: string;
  location_id: string;
  service_id: string;
  position: number;
  estimated_wait_time: number;
  status: 'waiting' | 'called' | 'in_service' | 'completed' | 'no_show';
  check_in_time: string;
  called_time?: string;
  service_start_time?: string;
  completion_time?: string;
  customer?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  service?: {
    name: string;
    estimated_duration: number;
  };
}

interface QueueStats {
  total_waiting: number;
  average_wait_time: number;
  longest_wait_time: number;
  total_served_today: number;
  current_service_count: number;
}

export function useRealtimeQueue(locationId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  // Get current queue positions
  const { data: queuePositions, isLoading: queueLoading } = useQuery({
    queryKey: ['queue-positions', locationId],
    queryFn: async (): Promise<QueuePosition[]> => {
      if (!locationId) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          customer_id,
          location_id,
          service_id,
          status,
          check_in_time,
          scheduled_time,
          customers!appointments_customer_id_fkey(first_name, last_name, phone),
          services!appointments_service_id_fkey(name, duration)
        `)
        .eq('location_id', locationId)
        .eq('status', 'checked_in')
        .order('check_in_time', { ascending: true });

      if (error) throw error;

      // Calculate positions and estimated wait times
      return (data || []).map((appointment, index) => {
        const estimatedWaitTime = index * (appointment.services?.duration || 30);
        
        return {
          id: appointment.id,
          customer_id: appointment.customer_id,
          location_id: appointment.location_id,
          service_id: appointment.service_id,
          position: index + 1,
          estimated_wait_time: estimatedWaitTime,
          status: 'waiting' as const,
          check_in_time: appointment.check_in_time || appointment.scheduled_time,
          customer: appointment.customers,
          service: appointment.services ? {
            name: appointment.services.name,
            estimated_duration: appointment.services.duration
          } : undefined
        };
      });
    },
    enabled: !!locationId,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Get queue statistics
  const { data: queueStats } = useQuery({
    queryKey: ['queue-stats', locationId],
    queryFn: async (): Promise<QueueStats> => {
      if (!locationId) return {
        total_waiting: 0,
        average_wait_time: 0,
        longest_wait_time: 0,
        total_served_today: 0,
        current_service_count: 0
      };

      const today = new Date().toISOString().split('T')[0];

      // Get waiting count
      const { data: waitingData } = await supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('location_id', locationId)
        .eq('status', 'checked_in');

      // Get completed today count
      const { data: completedData } = await supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('location_id', locationId)
        .eq('status', 'completed')
        .gte('end_time', `${today}T00:00:00`);

      // Get currently in service count
      const { data: inServiceData } = await supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('location_id', locationId)
        .eq('status', 'in_progress');

      return {
        total_waiting: waitingData?.length || 0,
        average_wait_time: 25, // Calculate from historical data
        longest_wait_time: 45, // Calculate from current queue
        total_served_today: completedData?.length || 0,
        current_service_count: inServiceData?.length || 0
      };
    },
    enabled: !!locationId,
    refetchInterval: 60000 // Refetch every minute
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!locationId) return;

    const channel = supabase
      .channel('queue-updates')
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
          
          // Invalidate relevant queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['queue-positions'] });
          queryClient.invalidateQueries({ queryKey: ['queue-stats'] });
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old?.status) {
            const statusMessages = {
              'in_progress': 'Service has started',
              'completed': 'Service completed',
              'no_show': 'Customer marked as no-show'
            };
            
            const message = statusMessages[payload.new.status as keyof typeof statusMessages];
            if (message) {
              toast({
                title: 'Queue Update',
                description: message,
              });
            }
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [locationId, queryClient, toast]);

  // Call next customer
  const callNextCustomer = async () => {
    if (!queuePositions || queuePositions.length === 0) {
      toast({
        title: 'No Customers',
        description: 'No customers in queue to call.',
        variant: 'destructive'
      });
      return;
    }

    const nextCustomer = queuePositions[0];
    
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'in_progress',
        start_time: new Date().toISOString()
      })
      .eq('id', nextCustomer.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to call next customer.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Customer Called',
      description: `${nextCustomer.customer?.first_name} ${nextCustomer.customer?.last_name} has been called.`,
    });
  };

  // Mark customer as in service
  const startService = async (customerId: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'in_progress',
        start_time: new Date().toISOString()
      })
      .eq('id', customerId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to start service.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Service Started',
      description: 'Customer service has been started.',
    });
  };

  // Complete service
  const completeService = async (customerId: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'completed',
        end_time: new Date().toISOString()
      })
      .eq('id', customerId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete service.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Service Completed',
      description: 'Customer service has been completed.',
    });
  };

  // Mark customer as no-show
  const markNoShow = async (customerId: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'no_show',
        end_time: new Date().toISOString()
      })
      .eq('id', customerId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark as no-show.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Marked as No-Show',
      description: 'Customer has been marked as no-show.',
    });
  };

  return {
    queuePositions,
    queueStats,
    queueLoading,
    isConnected,
    callNextCustomer,
    startService,
    completeService,
    markNoShow
  };
}
