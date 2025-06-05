
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const locationId = url.pathname.split('/').pop();

    if (!locationId) {
      return new Response(JSON.stringify({ error: 'Location ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Getting queue stats for location: ${locationId}`);

    const today = new Date().toISOString().split('T')[0];

    // Get location info
    const { data: location, error: locationError } = await supabaseClient
      .from('locations')
      .select('id, name, max_capacity, current_capacity')
      .eq('id', locationId)
      .single();

    if (locationError || !location) {
      return new Response(JSON.stringify({ 
        error: 'Location not found' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current queue count (checked in)
    const { data: queueData, error: queueError } = await supabaseClient
      .from('appointments')
      .select('id, check_in_time, service_id')
      .eq('location_id', locationId)
      .eq('status', 'checked_in')
      .order('check_in_time', { ascending: true });

    if (queueError) {
      console.error('Error fetching queue data:', queueError);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch queue data' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get currently being served count
    const { data: servingData, error: servingError } = await supabaseClient
      .from('appointments')
      .select('id', { count: 'exact' })
      .eq('location_id', locationId)
      .eq('status', 'in_progress');

    if (servingError) {
      console.error('Error fetching serving data:', servingError);
    }

    // Get completed today count
    const { data: completedData, error: completedError } = await supabaseClient
      .from('appointments')
      .select('id, start_time, end_time', { count: 'exact' })
      .eq('location_id', locationId)
      .eq('status', 'completed')
      .gte('end_time', `${today}T00:00:00`)
      .not('start_time', 'is', null)
      .not('end_time', 'is', null);

    if (completedError) {
      console.error('Error fetching completed data:', completedError);
    }

    // Calculate average wait time from completed appointments today
    let averageWaitTime = 15; // default
    if (completedData && completedData.length > 0) {
      const totalWaitTime = completedData.reduce((sum, appointment) => {
        if (appointment.start_time && appointment.end_time) {
          const waitTime = Math.floor((new Date(appointment.end_time).getTime() - new Date(appointment.start_time).getTime()) / 60000);
          return sum + waitTime;
        }
        return sum;
      }, 0);
      averageWaitTime = Math.round(totalWaitTime / completedData.length);
    }

    // Calculate longest current wait time
    let longestWaitTime = 0;
    if (queueData && queueData.length > 0) {
      const now = Date.now();
      longestWaitTime = queueData.reduce((longest, appointment) => {
        if (appointment.check_in_time) {
          const waitTime = Math.floor((now - new Date(appointment.check_in_time).getTime()) / 60000);
          return Math.max(longest, waitTime);
        }
        return longest;
      }, 0);
    }

    // Calculate estimated wait time for next customer
    const estimatedWaitForNext = queueData && queueData.length > 0 ? averageWaitTime : 0;

    const response = {
      location_id: locationId,
      location_name: location.name,
      total_waiting: queueData?.length || 0,
      currently_serving: servingData?.length || 0,
      completed_today: completedData?.length || 0,
      average_wait_time_minutes: averageWaitTime,
      longest_current_wait_minutes: longestWaitTime,
      estimated_wait_for_next_minutes: estimatedWaitForNext,
      capacity: {
        current: location.current_capacity,
        maximum: location.max_capacity,
        utilization_percentage: Math.round((location.current_capacity / location.max_capacity) * 100)
      },
      queue_status: queueData && queueData.length > 0 ? 'active' : 'empty',
      last_updated: new Date().toISOString()
    };

    console.log('Queue stats response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in queue-stats function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
