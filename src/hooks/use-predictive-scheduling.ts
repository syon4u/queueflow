
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DemandPrediction {
  id: string;
  location_id: string;
  service_id?: string;
  prediction_date: string;
  hour_of_day: number;
  day_of_week: number;
  predicted_demand: number;
  confidence_score: number;
  actual_demand?: number;
  accuracy_score?: number;
  model_version: string;
  created_at: string;
  updated_at: string;
}

interface DemandPattern {
  id: string;
  location_id: string;
  service_id?: string;
  pattern_type: string;
  pattern_key: string;
  average_demand: number;
  peak_demand: number;
  variance: number;
  sample_size: number;
  last_calculated: string;
  created_at: string;
  updated_at: string;
}

interface SchedulingRecommendation {
  id: string;
  location_id: string;
  service_id?: string;
  recommendation_date: string;
  hour_of_day: number;
  recommended_capacity: number;
  recommended_staff: number;
  priority_score: number;
  reasoning?: string;
  status: 'pending' | 'applied' | 'rejected';
  applied_at?: string;
  applied_by?: string;
  created_at: string;
  updated_at: string;
}

interface PredictionAccuracy {
  id: string;
  location_id: string;
  service_id?: string;
  prediction_date: string;
  model_version: string;
  mae?: number;
  rmse?: number;
  mape?: number;
  accuracy_percentage?: number;
  total_predictions: number;
  created_at: string;
}

export function usePredictiveScheduling() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get demand predictions
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
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

  // Get demand patterns
  const { data: patterns, isLoading: patternsLoading } = useQuery({
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

  // Get scheduling recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
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

  // Get prediction accuracy
  const { data: accuracy, isLoading: accuracyLoading } = useQuery({
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

  // Calculate demand patterns
  const calculateDemandPatterns = async (locationId?: string, serviceId?: string) => {
    setIsCalculating(true);
    try {
      const { data, error } = await supabase.rpc('calculate_demand_patterns', {
        target_location_id: locationId || null,
        target_service_id: serviceId || null
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['demand-patterns'] });

      toast({
        title: 'Success',
        description: `Calculated ${data.patterns_calculated} demand patterns for ${data.locations_processed} locations`,
      });

      return data;
    } catch (error) {
      console.error('Error calculating demand patterns:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate demand patterns',
        variant: 'destructive'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Generate demand predictions
  const generatePredictions = async (locationId: string, predictionDays: number = 7) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.rpc('generate_demand_predictions', {
        target_location_id: locationId,
        prediction_days: predictionDays
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['demand-predictions'] });

      toast({
        title: 'Success',
        description: `Generated ${data.predictions_generated} predictions for ${data.prediction_period_days} days`,
      });

      return data;
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate demand predictions',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply scheduling recommendation
  const applyRecommendation = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('scheduling_recommendations' as any)
        .update({
          status: 'applied',
          applied_at: new Date().toISOString()
        })
        .eq('id', recommendationId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduling-recommendations'] });

      toast({
        title: 'Success',
        description: 'Scheduling recommendation applied successfully',
      });
    } catch (error) {
      console.error('Error applying recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply scheduling recommendation',
        variant: 'destructive'
      });
    }
  };

  // Reject scheduling recommendation
  const rejectRecommendation = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('scheduling_recommendations' as any)
        .update({
          status: 'rejected'
        })
        .eq('id', recommendationId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduling-recommendations'] });

      toast({
        title: 'Success',
        description: 'Scheduling recommendation rejected',
      });
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject scheduling recommendation',
        variant: 'destructive'
      });
    }
  };

  return {
    predictions,
    patterns,
    recommendations,
    accuracy,
    predictionsLoading,
    patternsLoading,
    recommendationsLoading,
    accuracyLoading,
    isGenerating,
    isCalculating,
    calculateDemandPatterns,
    generatePredictions,
    applyRecommendation,
    rejectRecommendation
  };
}
