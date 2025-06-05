
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictiveAnalyticsRequest {
  action: 'generate_recommendations' | 'update_accuracy' | 'optimize_schedule';
  location_id?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
  parameters?: {
    confidence_threshold?: number;
    recommendation_window_days?: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, location_id, date_range, parameters }: PredictiveAnalyticsRequest = await req.json();

    console.log(`Processing predictive analytics request: ${action}`);

    let result;

    switch (action) {
      case 'generate_recommendations':
        result = await generateSchedulingRecommendations(supabaseClient, location_id, parameters);
        break;
      case 'update_accuracy':
        result = await updatePredictionAccuracy(supabaseClient, location_id, date_range);
        break;
      case 'optimize_schedule':
        result = await optimizeSchedule(supabaseClient, location_id, date_range);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: result,
      processed_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predictive-analytics function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

async function generateSchedulingRecommendations(
  supabaseClient: any, 
  locationId?: string,
  parameters?: any
): Promise<any> {
  const confidenceThreshold = parameters?.confidence_threshold || 0.7;
  const windowDays = parameters?.recommendation_window_days || 7;
  
  // Get high-confidence predictions
  const { data: predictions, error: predError } = await supabaseClient
    .from('demand_predictions')
    .select('*')
    .gte('confidence_score', confidenceThreshold)
    .gte('prediction_date', new Date().toISOString().split('T')[0])
    .lte('prediction_date', new Date(Date.now() + windowDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .eq(locationId ? 'location_id' : 'id', locationId || 'id');

  if (predError) throw predError;

  const recommendations = [];

  for (const prediction of predictions || []) {
    // Generate capacity recommendations based on predicted demand
    const recommendedCapacity = Math.ceil(prediction.predicted_demand * 1.2); // 20% buffer
    const recommendedStaff = Math.max(1, Math.ceil(prediction.predicted_demand / 8)); // Assume 8 appointments per staff member
    
    let reasoning = `Based on ${prediction.predicted_demand} predicted appointments with ${(prediction.confidence_score * 100).toFixed(1)}% confidence.`;
    let priorityScore = prediction.confidence_score;
    
    // Adjust recommendations based on demand level
    if (prediction.predicted_demand > 20) {
      reasoning += ' High demand period - consider additional staff.';
      priorityScore += 0.2;
    } else if (prediction.predicted_demand < 5) {
      reasoning += ' Low demand period - opportunity for staff optimization.';
      priorityScore -= 0.1;
    }

    // Check if we already have a recommendation for this time slot
    const { data: existingRec } = await supabaseClient
      .from('scheduling_recommendations')
      .select('id')
      .eq('location_id', prediction.location_id)
      .eq('recommendation_date', prediction.prediction_date)
      .eq('hour_of_day', prediction.hour_of_day)
      .single();

    if (!existingRec) {
      const { error: insertError } = await supabaseClient
        .from('scheduling_recommendations')
        .insert({
          location_id: prediction.location_id,
          service_id: prediction.service_id,
          recommendation_date: prediction.prediction_date,
          hour_of_day: prediction.hour_of_day,
          recommended_capacity: recommendedCapacity,
          recommended_staff: recommendedStaff,
          priority_score: Math.min(1.0, priorityScore),
          reasoning: reasoning,
          status: 'pending'
        });

      if (!insertError) {
        recommendations.push({
          prediction_id: prediction.id,
          recommended_capacity: recommendedCapacity,
          recommended_staff: recommendedStaff,
          priority_score: priorityScore
        });
      }
    }
  }

  return {
    recommendations_generated: recommendations.length,
    total_predictions_analyzed: predictions?.length || 0,
    confidence_threshold: confidenceThreshold,
    window_days: windowDays
  };
}

async function updatePredictionAccuracy(
  supabaseClient: any,
  locationId?: string,
  dateRange?: any
): Promise<any> {
  const startDate = dateRange?.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = dateRange?.end_date || new Date().toISOString().split('T')[0];

  // Get predictions with actual appointment data
  const { data: predictions, error: predError } = await supabaseClient
    .from('demand_predictions')
    .select(`
      *,
      actual_appointments:appointments!inner(count)
    `)
    .gte('prediction_date', startDate)
    .lte('prediction_date', endDate)
    .not('actual_demand', 'is', null);

  if (predError) throw predError;

  let totalPredictions = 0;
  let totalAbsoluteError = 0;
  let totalSquaredError = 0;
  let totalPercentageError = 0;

  for (const prediction of predictions || []) {
    const actualDemand = prediction.actual_demand || 0;
    const predictedDemand = prediction.predicted_demand;
    
    const absoluteError = Math.abs(actualDemand - predictedDemand);
    const squaredError = Math.pow(absoluteError, 2);
    const percentageError = actualDemand > 0 ? (absoluteError / actualDemand) * 100 : 0;

    totalPredictions++;
    totalAbsoluteError += absoluteError;
    totalSquaredError += squaredError;
    totalPercentageError += percentageError;

    // Update individual prediction accuracy
    await supabaseClient
      .from('demand_predictions')
      .update({
        accuracy_score: Math.max(0, 1 - (absoluteError / Math.max(actualDemand, predictedDemand, 1)))
      })
      .eq('id', prediction.id);
  }

  if (totalPredictions > 0) {
    const mae = totalAbsoluteError / totalPredictions;
    const rmse = Math.sqrt(totalSquaredError / totalPredictions);
    const mape = totalPercentageError / totalPredictions;
    const accuracy = Math.max(0, 100 - mape);

    // Insert accuracy record
    await supabaseClient
      .from('prediction_accuracy')
      .insert({
        location_id: locationId,
        prediction_date: endDate,
        model_version: 'v1.0',
        mae: mae,
        rmse: rmse,
        mape: mape,
        accuracy_percentage: accuracy,
        total_predictions: totalPredictions
      });

    return {
      total_predictions: totalPredictions,
      mae: mae,
      rmse: rmse,
      mape: mape,
      accuracy_percentage: accuracy
    };
  }

  return { message: 'No predictions found for accuracy calculation' };
}

async function optimizeSchedule(
  supabaseClient: any,
  locationId?: string,
  dateRange?: any
): Promise<any> {
  // This is a simplified optimization function
  // In a production environment, this would use more sophisticated algorithms
  
  const startDate = dateRange?.start_date || new Date().toISOString().split('T')[0];
  const endDate = dateRange?.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Get current capacity settings
  const { data: currentCapacity } = await supabaseClient
    .from('locations')
    .select('max_capacity, current_capacity')
    .eq('id', locationId)
    .single();

  // Get predictions for the period
  const { data: predictions } = await supabaseClient
    .from('demand_predictions')
    .select('*')
    .gte('prediction_date', startDate)
    .lte('prediction_date', endDate)
    .eq('location_id', locationId)
    .order('prediction_date')
    .order('hour_of_day');

  let optimizations = [];

  if (predictions && predictions.length > 0) {
    const maxPredictedDemand = Math.max(...predictions.map(p => p.predicted_demand));
    const avgPredictedDemand = predictions.reduce((sum, p) => sum + p.predicted_demand, 0) / predictions.length;

    // Suggest capacity adjustments
    if (maxPredictedDemand > (currentCapacity?.max_capacity || 50) * 0.9) {
      optimizations.push({
        type: 'capacity_increase',
        recommendation: `Consider increasing max capacity from ${currentCapacity?.max_capacity} to ${Math.ceil(maxPredictedDemand * 1.1)}`,
        priority: 'high',
        impact: 'Prevents bottlenecks during peak demand'
      });
    }

    // Suggest staff scheduling
    const peakHours = predictions
      .filter(p => p.predicted_demand > avgPredictedDemand * 1.5)
      .map(p => ({ date: p.prediction_date, hour: p.hour_of_day, demand: p.predicted_demand }));

    if (peakHours.length > 0) {
      optimizations.push({
        type: 'staff_scheduling',
        recommendation: `Schedule additional staff during ${peakHours.length} peak periods`,
        priority: 'medium',
        impact: 'Reduces wait times during high demand',
        details: peakHours.slice(0, 5)
      });
    }
  }

  return {
    optimizations_found: optimizations.length,
    period: { start_date: startDate, end_date: endDate },
    optimizations: optimizations
  };
}

serve(handler);
