
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

    console.log(`Getting full queue status for location: ${locationId}`);

    // Get location info
    const { data: location, error: locationError } = await supabaseClient
      .from('locations')
      .select('id, name, max_capacity, current_capacity, queue_status')
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

    // Get all appointments for today with relevant statuses
    const today = new Date().toISOString().split('T')[0];
    
    const { data: appointments, error: appointmentsError } = await supabaseClient
      .from('appointments')
      .select(`
        id,
        status,
        check_in_time,
        start_time,
        end_time,
        scheduled_time,
        customer_id,
        service_id
      `)
      .eq('location_id', locationId)
      .gte('scheduled_time', `${today}T00:00:00`)
      .lt('scheduled_time', `${today}T23:59:59`)
      .in('status', ['checked_in', 'in_progress', 'completed'])
      .order('check_in_time', { ascending: true, nullsFirst: false });

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch appointment data' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get customer and service data for the appointments
    const customerIds = [...new Set(appointments?.map(a => a.customer_id) || [])];
    const serviceIds = [...new Set(appointments?.map(a => a.service_id) || [])];

    const [customersResult, servicesResult] = await Promise.all([
      supabaseClient
        .from('customers')
        .select('id, first_name, last_name, phone')
        .in('id', customerIds),
      supabaseClient
        .from('services')
        .select('id, name, duration')
        .in('id', serviceIds)
    ]);

    const customers = customersResult.data || [];
    const services = servicesResult.data || [];

    // Process the queue data
    const processedQueue = appointments?.map((appointment, index) => {
      const customer = customers.find(c => c.id === appointment.customer_id);
      const service = services.find(s => s.id === appointment.service_id);
      
      // Calculate position for waiting customers
      const waitingAppointments = appointments.filter(a => a.status === 'checked_in');
      const waitingIndex = waitingAppointments.findIndex(a => a.id === appointment.id);
      const position = appointment.status === 'checked_in' ? waitingIndex + 1 : null;
      
      // Calculate wait times
      let currentWaitTime = 0;
      let estimatedWaitTime = 0;
      
      if (appointment.check_in_time) {
        currentWaitTime = Math.floor((Date.now() - new Date(appointment.check_in_time).getTime()) / 60000);
      }
      
      if (position && service) {
        estimatedWaitTime = Math.max(0, (position - 1) * service.duration);
      }

      return {
        appointment_id: appointment.id,
        ticket_number: appointment.id.slice(-8).toUpperCase(),
        customer: {
          name: customer ? `${customer.first_name} ${customer.last_name}`.trim() : 'Unknown Customer',
          phone: customer?.phone
        },
        service: {
          name: service?.name || 'Unknown Service',
          duration: service?.duration || 15
        },
        status: appointment.status,
        position: position,
        check_in_time: appointment.check_in_time,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        current_wait_time_minutes: currentWaitTime,
        estimated_wait_time_minutes: estimatedWaitTime
      };
    }) || [];

    // Separate by status
    const waiting = processedQueue.filter(item => item.status === 'checked_in');
    const serving = processedQueue.filter(item => item.status === 'in_progress');
    const completed = processedQueue.filter(item => item.status === 'completed');

    const response = {
      location: {
        id: locationId,
        name: location.name,
        queue_status: location.queue_status,
        capacity: {
          current: location.current_capacity,
          maximum: location.max_capacity,
          available: Math.max(0, location.max_capacity - location.current_capacity)
        }
      },
      queue: {
        waiting: waiting,
        currently_serving: serving,
        completed_today: completed
      },
      summary: {
        total_waiting: waiting.length,
        currently_serving: serving.length,
        completed_today: completed.length,
        average_wait_time: completed.length > 0 
          ? Math.round(completed.reduce((sum, item) => sum + item.current_wait_time_minutes, 0) / completed.length)
          : 0,
        longest_wait: waiting.length > 0 
          ? Math.max(...waiting.map(item => item.current_wait_time_minutes))
          : 0
      },
      last_updated: new Date().toISOString()
    };

    console.log(`Queue status response for ${locationId}:`, {
      waiting: waiting.length,
      serving: serving.length,
      completed: completed.length
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in queue-status function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
