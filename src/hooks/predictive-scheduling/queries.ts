
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DemandPrediction, DemandPattern, SchedulingRecommendation, PredictionAccuracy } from './types';

export function useDemandPredictions() {
  return useQuery({
    queryKey: ['demand-predictions'],
    queryFn: async (): Promise<DemandPrediction[]> => {
      const { data, error } = await supabase
        .from('demand_predictions' as any)
        .select('*')
        .gte('prediction_date', new Date().toISOString().split('T')[0])
        .order('prediction_date', { ascending: true })
        .order('hour_of_day', { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as DemandPrediction[];
    },
    refetchInterval: 300000 // Refetch every 5 minutes
  });
}

export function useDemandPatterns() {
  return useQuery({
    queryKey: ['demand-patterns'],
    queryFn: async (): Promise<DemandPattern[]> => {
      const { data, error } = await supabase
        .from('demand_patterns' as any)
        .select('*')
        .order('last_calculated', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as DemandPattern[];
    }
  });
}

export function useSchedulingRecommendations() {
  return useQuery({
    queryKey: ['scheduling-recommendations'],
    queryFn: async (): Promise<SchedulingRecommendation[]> => {
      const { data, error } = await supabase
        .from('scheduling_recommendations' as any)
        .select('*')
        .gte('recommendation_date', new Date().toISOString().split('T')[0])
        .order('recommendation_date', { ascending: true })
        .order('priority_score', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as SchedulingRecommendation[];
    }
  });
}

export function usePredictionAccuracy() {
  return useQuery({
    queryKey: ['prediction-accuracy'],
    queryFn: async (): Promise<PredictionAccuracy[]> => {
      const { data, error } = await supabase
        .from('prediction_accuracy' as any)
        .select('*')
        .order('prediction_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return (data || []) as unknown as PredictionAccuracy[];
    }
  });
}
