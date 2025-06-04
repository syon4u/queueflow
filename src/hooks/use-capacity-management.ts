
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
}

interface CapacityEvent {
  id: string;
  location_id: string;
  event_type: 'capacity_reached' | 'capacity_available' | 'override_applied';
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

  // Check location capacity
  const checkCapacity = async (locationId: string): Promise<CapacityStatus> => {
    const { data, error } = await supabase.rpc('check_location_capacity', {
      location_uuid: locationId
    });

    if (error) throw error;
    return data as CapacityStatus;
  };

  // Get capacity events
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

  // Get waitlist entries
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

  // Add to waitlist mutation
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
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2); // Expire in 2 hours

      const { data, error } = await supabase
        .from('capacity_waitlist')
        .insert({
          customer_id: customerId,
          location_id: locationId,
          service_id: serviceId,
          requested_time: requestedTime,
          priority_level: priorityLevel,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capacity-waitlist'] });
      toast({
        title: 'Added to Waitlist',
        description: 'You have been added to the waitlist and will be notified when capacity becomes available.'
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

  // Update capacity override mutation
  const capacityOverrideMutation = useMutation({
    mutationFn: async ({
      locationId,
      newCapacity,
      notes
    }: {
      locationId: string;
      newCapacity: number;
      notes?: string;
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

      // Log the event
      const { error: logError } = await supabase
        .from('capacity_events')
        .insert({
          location_id: locationId,
          event_type: 'override_applied',
          old_capacity: location?.max_capacity,
          new_capacity: newCapacity,
          max_capacity: newCapacity,
          notes: notes || 'Manual capacity override'
        });

      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['capacity-events'] });
      toast({
        title: 'Capacity Updated',
        description: 'Location capacity has been successfully updated.'
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

  // Convert waitlist entry to appointment
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
        description: 'Customer has been notified that capacity is available.'
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
