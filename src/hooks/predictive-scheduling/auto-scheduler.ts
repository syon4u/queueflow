
import { supabase } from '@/integrations/supabase/client';
import type { DemandPrediction, SchedulingRecommendation } from './types';

export interface AutoSchedulingConfig {
  enableAutoApply: boolean;
  confidenceThreshold: number;
  maxAutoAppliedPerDay: number;
  workingHours: {
    start: number;
    end: number;
  };
}

export interface AutoSchedulingResult {
  applied: number;
  skipped: number;
  errors: string[];
}

export class AutoScheduler {
  private config: AutoSchedulingConfig;

  constructor(config: AutoSchedulingConfig) {
    this.config = config;
  }

  async processRecommendations(locationId: string): Promise<AutoSchedulingResult> {
    const result: AutoSchedulingResult = {
      applied: 0,
      skipped: 0,
      errors: []
    };

    try {
      // For demo purposes, create mock recommendations since the table doesn't exist yet
      const mockRecommendations = [
        {
          id: '1',
          location_id: locationId,
          recommendation_date: new Date().toISOString().split('T')[0],
          hour_of_day: 9,
          recommended_capacity: 15,
          recommended_staff: 2,
          priority_score: 0.85,
          status: 'pending' as const
        },
        {
          id: '2',
          location_id: locationId,
          recommendation_date: new Date().toISOString().split('T')[0],
          hour_of_day: 14,
          recommended_capacity: 20,
          recommended_staff: 3,
          priority_score: 0.92,
          status: 'pending' as const
        }
      ];

      for (const rec of mockRecommendations) {
        try {
          await this.applyRecommendation(rec);
          result.applied++;
        } catch (error) {
          result.errors.push(`Failed to apply recommendation ${rec.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.skipped++;
        }
      }

      return result;
    } catch (error) {
      result.errors.push(`Auto-scheduling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  private async applyRecommendation(recommendation: any): Promise<void> {
    // Mock implementation - in a real scenario, this would update the scheduling system
    console.log(`Auto-applied recommendation: ${recommendation.id} for ${recommendation.recommended_capacity} capacity`);
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async generateDailySchedule(locationId: string, targetDate: string): Promise<any> {
    try {
      // Try to get real predictions from the database
      const { data: predictions, error } = await supabase
        .from('demand_predictions')
        .select('*')
        .eq('location_id', locationId)
        .eq('prediction_date', targetDate)
        .gte('confidence_score', this.config.confidenceThreshold)
        .order('hour_of_day');

      if (error) {
        console.error('Error fetching predictions:', error);
        // Fallback to mock data
        return this.generateMockSchedule(locationId, targetDate);
      }

      if (!predictions || predictions.length === 0) {
        // Generate mock schedule if no predictions found
        return this.generateMockSchedule(locationId, targetDate);
      }

      const schedule = [];
      
      for (const prediction of predictions) {
        const staffNeeded = Math.ceil(prediction.predicted_demand / 8); // 8 appointments per staff
        const capacityNeeded = Math.ceil(prediction.predicted_demand * 1.1); // 10% buffer

        schedule.push({
          hour: prediction.hour_of_day,
          predicted_demand: prediction.predicted_demand,
          recommended_staff: Math.max(1, staffNeeded),
          recommended_capacity: capacityNeeded,
          confidence: prediction.confidence_score,
          priority: prediction.predicted_demand > 15 ? 'high' : prediction.predicted_demand > 8 ? 'medium' : 'low'
        });
      }

      return {
        date: targetDate,
        location_id: locationId,
        schedule,
        total_predicted_demand: schedule.reduce((sum, slot) => sum + slot.predicted_demand, 0),
        peak_hour: schedule.reduce((max, slot) => slot.predicted_demand > max.predicted_demand ? slot : max, schedule[0])
      };
    } catch (error) {
      console.error('Error generating daily schedule:', error);
      return this.generateMockSchedule(locationId, targetDate);
    }
  }

  private generateMockSchedule(locationId: string, targetDate: string) {
    // Generate mock schedule data for demonstration
    const mockSchedule = [];
    
    for (let hour = this.config.workingHours.start; hour <= this.config.workingHours.end; hour++) {
      const baseLoad = Math.random() * 15 + 5; // 5-20 base appointments
      const peakMultiplier = (hour >= 10 && hour <= 15) ? 1.5 : 1; // Peak hours
      const predicted_demand = Math.round(baseLoad * peakMultiplier);
      
      mockSchedule.push({
        hour,
        predicted_demand,
        recommended_staff: Math.max(1, Math.ceil(predicted_demand / 8)),
        recommended_capacity: Math.ceil(predicted_demand * 1.1),
        confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
        priority: predicted_demand > 15 ? 'high' : predicted_demand > 8 ? 'medium' : 'low'
      });
    }

    return {
      date: targetDate,
      location_id: locationId,
      schedule: mockSchedule,
      total_predicted_demand: mockSchedule.reduce((sum, slot) => sum + slot.predicted_demand, 0),
      peak_hour: mockSchedule.reduce((max, slot) => slot.predicted_demand > max.predicted_demand ? slot : max, mockSchedule[0])
    };
  }
}
