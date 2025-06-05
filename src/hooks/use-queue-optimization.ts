
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { QueueOptimizer } from './queue-optimization/queue-optimizer';
import type { OptimizationRecommendation, QueueOptimizationRule } from './queue-optimization/types';

export function useQueueOptimization() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizer] = useState(() => new QueueOptimizer());

  // Get optimization recommendations
  const { 
    data: recommendations, 
    isLoading: recommendationsLoading,
    refetch: refetchRecommendations
  } = useQuery({
    queryKey: ['queue-optimization-recommendations'],
    queryFn: async (): Promise<OptimizationRecommendation[]> => {
      // For demo purposes, using a default location
      return await optimizer.optimizeQueue('demo-location');
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Apply optimization recommendation
  const applyOptimization = async (recommendation: OptimizationRecommendation) => {
    setIsOptimizing(true);
    try {
      await optimizer.applyOptimization(recommendation);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['queue-positions'] });
      queryClient.invalidateQueries({ queryKey: ['queue-optimization-recommendations'] });

      toast({
        title: 'Optimization Applied',
        description: `Moved appointment to position ${recommendation.recommendedPosition}. Estimated time savings: ${recommendation.estimatedSavings.timeMinutes} minutes`,
      });

    } catch (error) {
      console.error('Error applying optimization:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply queue optimization',
        variant: 'destructive'
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Batch apply multiple optimizations
  const applyBatchOptimizations = async (recommendations: OptimizationRecommendation[]) => {
    setIsOptimizing(true);
    try {
      for (const rec of recommendations) {
        await optimizer.applyOptimization(rec);
      }

      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['queue-positions'] });
      queryClient.invalidateQueries({ queryKey: ['queue-optimization-recommendations'] });

      const totalTimeSavings = recommendations.reduce((sum, rec) => sum + rec.estimatedSavings.timeMinutes, 0);

      toast({
        title: 'Batch Optimization Completed',
        description: `Applied ${recommendations.length} optimizations. Total estimated time savings: ${totalTimeSavings} minutes`,
      });

    } catch (error) {
      console.error('Error applying batch optimizations:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply some optimizations',
        variant: 'destructive'
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    recommendations,
    recommendationsLoading,
    isOptimizing,
    applyOptimization,
    applyBatchOptimizations,
    refetchRecommendations
  };
}
