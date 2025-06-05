
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { AutoScheduler, type AutoSchedulingConfig, type AutoSchedulingResult } from './predictive-scheduling/auto-scheduler';

const defaultConfig: AutoSchedulingConfig = {
  enableAutoApply: false,
  confidenceThreshold: 0.8,
  maxAutoAppliedPerDay: 10,
  workingHours: {
    start: 8,
    end: 17
  }
};

export function useAutoScheduler() {
  const { toast } = useToast();
  const [config, setConfig] = useState<AutoSchedulingConfig>(defaultConfig);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoScheduler] = useState(() => new AutoScheduler(config));

  // Get daily schedule for preview
  const { data: dailySchedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ['daily-schedule', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      return await autoScheduler.generateDailySchedule(
        'demo-location', 
        new Date().toISOString().split('T')[0]
      );
    },
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  // Process recommendations
  const processRecommendations = async (locationId: string = 'demo-location') => {
    setIsProcessing(true);
    try {
      const result = await autoScheduler.processRecommendations(locationId);
      
      toast({
        title: 'Auto-Scheduling Complete',
        description: `Applied ${result.applied} recommendations, skipped ${result.skipped}. ${result.errors.length} errors.`,
        variant: result.errors.length > 0 ? 'destructive' : 'default'
      });

      return result;
    } catch (error) {
      console.error('Error processing recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to process scheduling recommendations',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Update configuration
  const updateConfig = (newConfig: Partial<AutoSchedulingConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    // Update the auto scheduler instance with new config
    autoScheduler['config'] = updatedConfig;
  };

  return {
    config,
    dailySchedule,
    scheduleLoading,
    isProcessing,
    updateConfig,
    processRecommendations
  };
}
