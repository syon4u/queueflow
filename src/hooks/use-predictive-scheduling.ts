
import { 
  useDemandPredictions, 
  useDemandPatterns, 
  useSchedulingRecommendations, 
  usePredictionAccuracy 
} from './predictive-scheduling/queries';
import { usePredictiveSchedulingMutations } from './predictive-scheduling/mutations';

export function usePredictiveScheduling() {
  const { 
    data: predictions, 
    isLoading: predictionsLoading 
  } = useDemandPredictions();
  
  const { 
    data: patterns, 
    isLoading: patternsLoading 
  } = useDemandPatterns();
  
  const { 
    data: recommendations, 
    isLoading: recommendationsLoading 
  } = useSchedulingRecommendations();
  
  const { 
    data: accuracy, 
    isLoading: accuracyLoading 
  } = usePredictionAccuracy();

  const {
    isGenerating,
    isCalculating,
    calculateDemandPatterns,
    generatePredictions,
    applyRecommendation,
    rejectRecommendation
  } = usePredictiveSchedulingMutations();

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

// Re-export types for convenience
export type { 
  DemandPrediction, 
  DemandPattern, 
  SchedulingRecommendation, 
  PredictionAccuracy,
  PatternCalculationResult,
  PredictionGenerationResult
} from './predictive-scheduling/types';
