
export interface DemandPrediction {
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

export interface DemandPattern {
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

export interface SchedulingRecommendation {
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

export interface PredictionAccuracy {
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

export interface PatternCalculationResult {
  patterns_calculated: number;
  locations_processed: number;
  services_processed: number;
  calculated_at: string;
}

export interface PredictionGenerationResult {
  predictions_generated: number;
  location_id: string;
  prediction_period_days: number;
  generated_at: string;
}
