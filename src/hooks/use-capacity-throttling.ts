
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThrottlingRule {
  id: string;
  location_id: string;
  service_id?: string;
  day_of_week: number;
  hour_of_day: number;
  max_capacity: number;
  throttle_threshold: number; // Percentage at which to start throttling
  waitlist_enabled: boolean;
  dynamic_adjustment: boolean;
  created_at: string;
  updated_at: string;
}

interface ThrottlingStatus {
  location_id: string;
  service_id?: string;
  current_capacity: number;
  max_capacity: number;
  throttle_threshold: number;
  is_throttled: boolean;
  throttle_reason: string;
  waitlist_count: number;
  estimated_wait_time: number;
  next_available_slot: string;
}

interface CapacityPrediction {
  time_slot: string;
  predicted_demand: number;
  recommended_capacity: number;
  confidence_score: number;
  adjustment_reason: string;
}

export function useCapacityThrottling(locationId?: string, serviceId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [throttlingActive, setThrottlingActive] = useState(false);

  // Get throttling rules
  const { data: throttlingRules, isLoading: rulesLoading } = useQuery({
    queryKey: ['throttling-rules', locationId, serviceId],
    queryFn: async () => {
      let query = supabase
        .from('capacity_settings')
        .select('*')
        .order('day_of_week, hour_of_day');

      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ThrottlingRule[];
    },
    enabled: !!locationId
  });

  // Get current throttling status
  const { data: throttlingStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['throttling-status', locationId, serviceId],
    queryFn: async (): Promise<ThrottlingStatus[]> => {
      if (!locationId) return [];

      // Get current capacity and calculate throttling status
      const { data: locations } = await supabase
        .from('locations')
        .select('*')
        .eq('id', locationId);

      if (!locations || locations.length === 0) return [];

      const location = locations[0];
      const currentHour = new Date().getHours();
      const currentDay = new Date().getDay();

      // Get applicable throttling rule
      const rule = throttlingRules?.find(r => 
        r.day_of_week === currentDay && 
        r.hour_of_day === currentHour &&
        (!serviceId || r.service_id === serviceId)
      );

      const maxCapacity = rule?.max_capacity || location.max_capacity;
      const throttleThreshold = rule?.throttle_threshold || 80;
      const currentUtilization = (location.current_capacity / maxCapacity) * 100;
      const isThrottled = currentUtilization >= throttleThreshold;

      // Get waitlist count
      const { data: waitlistCount } = await supabase
        .from('capacity_waitlist')
        .select('id', { count: 'exact' })
        .eq('location_id', locationId)
        .eq('status', 'waiting');

      // Calculate estimated wait time based on historical data
      const { data: avgServiceTime } = await supabase
        .from('service_wait_times')
        .select('average_wait_time')
        .eq('service_id', serviceId || throttlingRules?.[0]?.service_id)
        .eq('day_of_week', currentDay)
        .eq('hour_of_day', currentHour)
        .maybeSingle();

      const estimatedWaitTime = avgServiceTime?.average_wait_time || 30;
      const nextAvailableSlot = new Date(Date.now() + (estimatedWaitTime * 60000)).toISOString();

      let throttleReason = '';
      if (isThrottled) {
        if (currentUtilization >= 100) {
          throttleReason = 'At maximum capacity';
        } else if (currentUtilization >= 90) {
          throttleReason = 'Near capacity - quality protection';
        } else {
          throttleReason = 'Preventive throttling active';
        }
      }

      return [{
        location_id: locationId,
        service_id: serviceId,
        current_capacity: location.current_capacity,
        max_capacity: maxCapacity,
        throttle_threshold: throttleThreshold,
        is_throttled: isThrottled,
        throttle_reason: throttleReason,
        waitlist_count: waitlistCount?.count || 0,
        estimated_wait_time: estimatedWaitTime,
        next_available_slot: nextAvailableSlot
      }];
    },
    enabled: !!locationId && !!throttlingRules,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Get capacity predictions
  const { data: predictions } = useQuery({
    queryKey: ['capacity-predictions', locationId, serviceId],
    queryFn: async (): Promise<CapacityPrediction[]> => {
      if (!locationId) return [];

      // Generate predictions for next 24 hours based on historical data
      const predictions: CapacityPrediction[] = [];
      const now = new Date();
      
      for (let i = 1; i <= 24; i++) {
        const futureTime = new Date(now.getTime() + (i * 60 * 60 * 1000));
        const dayOfWeek = futureTime.getDay();
        const hourOfDay = futureTime.getHours();

        // Get historical data for this time slot
        const { data: historicalData } = await supabase
          .from('appointments')
          .select('id')
          .eq('location_id', locationId)
          .gte('scheduled_time', `${futureTime.toISOString().split('T')[0]}T${hourOfDay.toString().padStart(2, '0')}:00:00`)
          .lt('scheduled_time', `${futureTime.toISOString().split('T')[0]}T${(hourOfDay + 1).toString().padStart(2, '0')}:00:00`)
          .eq('status', 'completed');

        const historicalCount = historicalData?.length || 0;
        
        // Simple prediction model (can be enhanced with ML)
        const baselineDemand = historicalCount;
        const seasonalFactor = getSeasonalFactor(dayOfWeek, hourOfDay);
        const trendFactor = getTrendFactor(i);
        
        const predictedDemand = Math.round(baselineDemand * seasonalFactor * trendFactor);
        const recommendedCapacity = Math.ceil(predictedDemand * 1.2); // 20% buffer
        const confidenceScore = Math.max(60, 100 - (i * 2)); // Decreases with time

        let adjustmentReason = 'Historical average';
        if (seasonalFactor > 1.2) {
          adjustmentReason = 'Peak time adjustment';
        } else if (seasonalFactor < 0.8) {
          adjustmentReason = 'Low demand period';
        }

        predictions.push({
          time_slot: futureTime.toISOString(),
          predicted_demand: predictedDemand,
          recommended_capacity: recommendedCapacity,
          confidence_score: confidenceScore,
          adjustment_reason: adjustmentReason
        });
      }

      return predictions;
    },
    enabled: !!locationId,
    staleTime: 300000 // Cache for 5 minutes
  });

  // Helper functions for prediction model
  const getSeasonalFactor = (dayOfWeek: number, hourOfDay: number): number => {
    // Peak hours: 9-11 AM and 2-4 PM on weekdays
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isMorningPeak = hourOfDay >= 9 && hourOfDay <= 11;
    const isAfternoonPeak = hourOfDay >= 14 && hourOfDay <= 16;
    
    if (isWeekday && (isMorningPeak || isAfternoonPeak)) {
      return 1.4;
    } else if (isWeekday && hourOfDay >= 8 && hourOfDay <= 17) {
      return 1.1;
    } else if (!isWeekday) {
      return 0.7;
    }
    return 0.5; // Off hours
  };

  const getTrendFactor = (hoursAhead: number): number => {
    // Slight upward trend for near-term, uncertainty for far-term
    if (hoursAhead <= 4) return 1.0;
    if (hoursAhead <= 12) return 0.95;
    return 0.9;
  };

  // Create or update throttling rule
  const createThrottlingRuleMutation = useMutation({
    mutationFn: async (rule: Omit<ThrottlingRule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('capacity_settings')
        .upsert({
          ...rule,
          staff_multiplier: 1.0,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['throttling-rules'] });
      toast({
        title: 'Throttling Rule Updated',
        description: 'Capacity throttling rule has been successfully configured.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update throttling rule: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Apply dynamic capacity adjustment
  const applyDynamicAdjustmentMutation = useMutation({
    mutationFn: async ({ prediction }: { prediction: CapacityPrediction }) => {
      if (!locationId) throw new Error('Location ID required');

      const targetTime = new Date(prediction.time_slot);
      const dayOfWeek = targetTime.getDay();
      const hourOfDay = targetTime.getHours();

      const { error } = await supabase
        .from('capacity_settings')
        .upsert({
          location_id: locationId,
          service_id: serviceId,
          day_of_week: dayOfWeek,
          hour_of_day: hourOfDay,
          max_capacity: prediction.recommended_capacity,
          throttle_threshold: 80,
          waitlist_enabled: true,
          dynamic_adjustment: true,
          staff_multiplier: 1.0,
          is_active: true
        });

      if (error) throw error;

      // Log the adjustment
      await supabase
        .from('capacity_events')
        .insert({
          location_id: locationId,
          event_type: 'capacity_reached',
          new_capacity: prediction.recommended_capacity,
          notes: `Dynamic adjustment: ${prediction.adjustment_reason} (Confidence: ${prediction.confidence_score}%)`
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['throttling-rules'] });
      queryClient.invalidateQueries({ queryKey: ['capacity-events'] });
      toast({
        title: 'Dynamic Adjustment Applied',
        description: 'Capacity has been automatically adjusted based on predictions.'
      });
    }
  });

  // Toggle throttling for location
  const toggleThrottlingMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!locationId) throw new Error('Location ID required');

      const { error } = await supabase
        .from('capacity_settings')
        .update({ is_active: enabled })
        .eq('location_id', locationId);

      if (error) throw error;
    },
    onSuccess: (_, enabled) => {
      setThrottlingActive(enabled);
      queryClient.invalidateQueries({ queryKey: ['throttling-rules'] });
      toast({
        title: enabled ? 'Throttling Enabled' : 'Throttling Disabled',
        description: `Capacity throttling has been ${enabled ? 'activated' : 'deactivated'} for this location.`
      });
    }
  });

  return {
    throttlingRules,
    rulesLoading,
    throttlingStatus: throttlingStatus?.[0],
    statusLoading,
    predictions,
    throttlingActive,
    createThrottlingRule: createThrottlingRuleMutation.mutate,
    creatingRule: createThrottlingRuleMutation.isPending,
    applyDynamicAdjustment: applyDynamicAdjustmentMutation.mutate,
    applyingAdjustment: applyDynamicAdjustmentMutation.isPending,
    toggleThrottling: toggleThrottlingMutation.mutate,
    togglingThrottling: toggleThrottlingMutation.isPending
  };
}
