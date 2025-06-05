
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PatternCalculationResult, PredictionGenerationResult } from './types';

export function usePredictiveSchedulingMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate demand patterns
  const calculateDemandPatterns = async (locationId?: string, serviceId?: string) => {
    setIsCalculating(true);
    try {
      const { data, error } = await supabase.rpc('calculate_demand_patterns', {
        target_location_id: locationId || null,
        target_service_id: serviceId || null
      });

      if (error) throw error;

      const result = data as unknown as PatternCalculationResult;

      queryClient.invalidateQueries({ queryKey: ['demand-patterns'] });

      toast({
        title: 'Success',
        description: `Calculated ${result.patterns_calculated} demand patterns for ${result.locations_processed} locations`,
      });

      return result;
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

      const result = data as unknown as PredictionGenerationResult;

      queryClient.invalidateQueries({ queryKey: ['demand-predictions'] });

      toast({
        title: 'Success',
        description: `Generated ${result.predictions_generated} predictions for ${result.prediction_period_days} days`,
      });

      return result;
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
    isGenerating,
    isCalculating,
    calculateDemandPatterns,
    generatePredictions,
    applyRecommendation,
    rejectRecommendation
  };
}
