
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
      // Get pending recommendations with high confidence
      const { data: recommendations, error } = await supabase
        .from('scheduling_recommendations' as any)
        .select('*')
        .eq('location_id', locationId)
        .eq('status', 'pending')
        .gte('priority_score', this.config.confidenceThreshold)
        .gte('hour_of_day', this.config.workingHours.start)
        .lte('hour_of_day', this.config.workingHours.end)
        .order('priority_score', { ascending: false })
        .limit(this.config.maxAutoAppliedPerDay);

      if (error) throw error;

      for (const rec of recommendations || []) {
        try {
          await this.applyRecommendation(rec);
          result.applied++;
        } catch (error) {
          result.errors.push(`Failed to apply recommendation ${rec.id}: ${error.message}`);
          result.skipped++;
        }
      }

      return result;
    } catch (error) {
      result.errors.push(`Auto-scheduling failed: ${error.message}`);
      return result;
    }
  }

  private async applyRecommendation(recommendation: SchedulingRecommendation): Promise<void> {
    // Update the recommendation status
    const { error } = await supabase
      .from('scheduling_recommendations' as any)
      .update({
        status: 'applied',
        applied_at: new Date().toISOString(),
        applied_by: 'auto-scheduler'
      })
      .eq('id', recommendation.id);

    if (error) throw error;

    // Here you could also trigger capacity updates or staff scheduling
    console.log(`Auto-applied recommendation: ${recommendation.id} for ${recommendation.recommended_capacity} capacity`);
  }

  async generateDailySchedule(locationId: string, targetDate: string): Promise<any> {
    // Get predictions for the target date
    const { data: predictions, error } = await supabase
      .from('demand_predictions' as any)
      .select('*')
      .eq('location_id', locationId)
      .eq('prediction_date', targetDate)
      .gte('confidence_score', this.config.confidenceThreshold)
      .order('hour_of_day');

    if (error) throw error;

    const schedule = [];
    
    for (const prediction of predictions || []) {
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
  }
}
