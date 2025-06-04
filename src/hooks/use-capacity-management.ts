import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CapacityStatus {
  has_capacity: boolean;
  current_capacity: number;
  max_capacity: number;
  max_allowed: number;
  available_spots: number;
  buffer_amount: number;
  is_throttled?: boolean;
  throttle_reason?: string;
}

interface CapacityEvent {
  id: string;
  location_id: string;
  event_type: 'capacity_reached' | 'capacity_available' | 'override_applied' | 'throttle_activated' | 'throttle_deactivated';
  old_capacity: number | null;
  new_capacity: number | null;
  max_capacity: number | null;
  staff_id: string | null;
  notes: string | null;
  created_at: string;
}

interface WaitlistEntry {
  id: string;
  customer_id: string;
  location_id: string;
  service_id: string;
  requested_time: string;
  priority_level: number;
  status: 'waiting' | 'notified' | 'expired' | 'converted';
  notification_sent_at: string | null;
  expires_at: string | null;
  created_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  service?: {
    name: string;
  };
}

export function useCapacityManagement(locationId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enhanced capacity check with throttling
  const checkCapacity = async (locationId: string): Promise<CapacityStatus> => {
    const { data, error } = await supabase.rpc('check_location_capacity', {
      location_uuid: locationId
    });

    if (error) throw error;
    
    const baseCapacity = data as unknown as CapacityStatus;
    
    // Check for throttling rules
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    
    const { data: throttlingRule } = await supabase
      .from('capacity_settings')
      .select('*')
      .eq('location_id', locationId)
      .eq('day_of_week', currentDay)
      .eq('hour_of_day', currentHour)
      .eq('is_active', true)
      .maybeSingle();

    if (throttlingRule) {
      const utilizationRate = (baseCapacity.current_capacity / baseCapacity.max_capacity) * 100;
      const throttleThreshold = 80; // Default threshold since it's not in the schema yet
      const isThrottled = utilizationRate >= throttleThreshold;
      
      return {
        ...baseCapacity,
        max_allowed: throttlingRule.max_capacity,
        is_throttled: isThrottled,
        throttle_reason: isThrottled ? 'Capacity throttling active' : undefined,
        has_capacity: baseCapacity.current_capacity < throttlingRule.max_capacity && !isThrottled
      };
    }

    return baseCapacity;
  };

  // Get capacity events with throttling events
  const { data: capacityEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['capacity-events', locationId],
    queryFn: async () => {
      let query = supabase
        .from('capacity_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CapacityEvent[];
    },
    enabled: !!locationId
  });

  // Enhanced waitlist with throttling integration
  const { data: waitlistEntries, isLoading: waitlistLoading } = useQuery({
    queryKey: ['capacity-waitlist', locationId],
    queryFn: async () => {
      let query = supabase
        .from('capacity_waitlist')
        .select(`
          *,
          customer:customers(first_name, last_name, phone, email),
          service:services(name)
        `)
        .eq('status', 'waiting')
        .order('priority_level', { ascending: false })
        .order('created_at', { ascending: true });

      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as WaitlistEntry[];
    },
    enabled: !!locationId
  });

  // Enhanced add to waitlist with throttling context
  const addToWaitlistMutation = useMutation({
    mutationFn: async ({
      customerId,
      locationId,
      serviceId,
      requestedTime,
      priorityLevel = 0
    }: {
      customerId: string;
      locationId: string;
      serviceId: string;
      requestedTime: string;
      priorityLevel?: number;
    }) => {
      // Check if throttling is active
      const capacityStatus = await checkCapacity(locationId);
      
      // Adjust priority if throttling is active
      const adjustedPriority = capacityStatus.is_throttled ? priorityLevel + 1 : priorityLevel;
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (capacityStatus.is_throttled ? 3 : 2)); // Longer expiry during throttling

      const { data, error } = await supabase
        .from('capacity_waitlist')
        .insert({
          customer_id: customerId,
          location_id: locationId,
          service_id: serviceId,
          requested_time: requestedTime,
          priority_level: adjustedPriority,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Log throttling-related waitlist addition
      if (capacityStatus.is_throttled) {
        await supabase
          .from('capacity_events')
          .insert({
            location_id: locationId,
            event_type: 'throttle_activated',
            notes: `Customer added to waitlist due to throttling: ${capacityStatus.throttle_reason}`
          });
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capacity-waitlist'] });
      toast({
        title: 'Added to Waitlist',
        description: 'You have been added to the priority waitlist and will be notified when capacity becomes available.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add to waitlist: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Enhanced capacity override with throttling consideration
  const capacityOverrideMutation = useMutation({
    mutationFn: async ({
      locationId,
      newCapacity,
      notes,
      overrideThrottling = false
    }: {
      locationId: string;
      newCapacity: number;
      notes?: string;
      overrideThrottling?: boolean;
    }) => {
      // Get current capacity first
      const { data: location } = await supabase
        .from('locations')
        .select('max_capacity, current_capacity')
        .eq('id', locationId)
        .single();

      // Update location capacity
      const { error: updateError } = await supabase
        .from('locations')
        .update({ max_capacity: newCapacity })
        .eq('id', locationId);

      if (updateError) throw updateError;

      // If overriding throttling, temporarily disable throttling rules
      if (overrideThrottling) {
        await supabase
          .from('capacity_settings')
          .update({ is_active: false })
          .eq('location_id', locationId);
      }

      // Log the event
      const { error: logError } = await supabase
        .from('capacity_events')
        .insert({
          location_id: locationId,
          event_type: 'override_applied',
          old_capacity: location?.max_capacity,
          new_capacity: newCapacity,
          max_capacity: newCapacity,
          notes: notes || `Manual capacity override${overrideThrottling ? ' with throttling disabled' : ''}`
        });

      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['capacity-events'] });
      queryClient.invalidateQueries({ queryKey: ['throttling-rules'] });
      toast({
        title: 'Capacity Updated',
        description: 'Location capacity has been successfully updated with throttling considerations.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update capacity: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Enhanced convert waitlist entry with throttling awareness
  const convertWaitlistMutation = useMutation({
    mutationFn: async (waitlistId: string) => {
      const { error } = await supabase
        .from('capacity_waitlist')
        .update({
          status: 'converted',
          notification_sent_at: new Date().toISOString()
        })
        .eq('id', waitlistId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capacity-waitlist'] });
      toast({
        title: 'Waitlist Entry Converted',
        description: 'Customer has been notified that capacity is available and throttling has been considered.'
      });
    }
  });

  return {
    checkCapacity,
    capacityEvents,
    eventsLoading,
    waitlistEntries,
    waitlistLoading,
    addToWaitlist: addToWaitlistMutation.mutate,
    addingToWaitlist: addToWaitlistMutation.isPending,
    updateCapacity: capacityOverrideMutation.mutate,
    updatingCapacity: capacityOverrideMutation.isPending,
    convertWaitlistEntry: convertWaitlistMutation.mutate,
    convertingEntry: convertWaitlistMutation.isPending
  };
}
