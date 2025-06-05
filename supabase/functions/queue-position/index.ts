
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
    const appointmentId = url.pathname.split('/').pop();

    if (!appointmentId) {
      return new Response(JSON.stringify({ error: 'Appointment ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Getting queue position for appointment: ${appointmentId}`);

    // Get the specific appointment
    const { data: appointment, error: appointmentError } = await supabaseClient
      .from('appointments')
      .select(`
        id,
        status,
        check_in_time,
        scheduled_time,
        location_id,
        service_id,
        customers!appointments_customer_id_fkey(first_name, last_name),
        services!appointments_service_id_fkey(name, duration)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return new Response(JSON.stringify({ 
        error: 'Appointment not found' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If not checked in, return basic info
    if (appointment.status !== 'checked_in') {
      return new Response(JSON.stringify({
        appointment_id: appointmentId,
        status: appointment.status,
        customer_name: `${appointment.customers?.first_name} ${appointment.customers?.last_name}`.trim(),
        service_name: appointment.services?.name,
        message: appointment.status === 'in_progress' ? 'Currently being served' : 
                appointment.status === 'completed' ? 'Service completed' : 
                'Not in queue'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all checked-in appointments for the same location, ordered by check-in time
    const { data: queueData, error: queueError } = await supabaseClient
      .from('appointments')
      .select('id, check_in_time')
      .eq('location_id', appointment.location_id)
      .eq('status', 'checked_in')
      .order('check_in_time', { ascending: true });

    if (queueError) {
      console.error('Error fetching queue:', queueError);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch queue data' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find position in queue
    const position = queueData.findIndex(item => item.id === appointmentId) + 1;
    
    if (position === 0) {
      return new Response(JSON.stringify({ 
        error: 'Appointment not found in queue' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate estimated wait time (position * average service duration)
    const estimatedWaitTime = Math.max(0, (position - 1) * (appointment.services?.duration || 15));
    
    // Calculate actual wait time so far
    const checkInTime = new Date(appointment.check_in_time);
    const currentWaitTime = Math.floor((Date.now() - checkInTime.getTime()) / 60000); // in minutes

    const response = {
      appointment_id: appointmentId,
      status: appointment.status,
      position: position,
      total_in_queue: queueData.length,
      estimated_wait_time_minutes: estimatedWaitTime,
      current_wait_time_minutes: currentWaitTime,
      customer_name: `${appointment.customers?.first_name} ${appointment.customers?.last_name}`.trim(),
      service_name: appointment.services?.name,
      check_in_time: appointment.check_in_time,
      ticket_number: appointmentId.slice(-8).toUpperCase(),
      location_id: appointment.location_id
    };

    console.log('Queue position response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in queue-position function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
