
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

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { action, appointment_id, location_id, staff_id } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing queue action: ${action} for appointment: ${appointment_id}`);

    switch (action) {
      case 'call-next': {
        if (!location_id) {
          return new Response(JSON.stringify({ error: 'Location ID is required for call-next action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get the next waiting customer
        const { data: nextCustomer, error: nextError } = await supabaseClient
          .from('appointments')
          .select(`
            id,
            customer_id,
            service_id,
            customers!appointments_customer_id_fkey(first_name, last_name),
            services!appointments_service_id_fkey(name)
          `)
          .eq('location_id', location_id)
          .eq('status', 'checked_in')
          .order('check_in_time', { ascending: true })
          .limit(1)
          .single();

        if (nextError || !nextCustomer) {
          return new Response(JSON.stringify({ 
            error: 'No customers waiting in queue' 
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Update appointment to in_progress
        const { error: updateError } = await supabaseClient
          .from('appointments')
          .update({ 
            status: 'in_progress',
            start_time: new Date().toISOString(),
            staff_id: staff_id
          })
          .eq('id', nextCustomer.id);

        if (updateError) {
          console.error('Error updating appointment:', updateError);
          return new Response(JSON.stringify({ 
            error: 'Failed to call next customer' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          action: 'call-next',
          customer: {
            appointment_id: nextCustomer.id,
            name: `${nextCustomer.customers?.first_name} ${nextCustomer.customers?.last_name}`.trim(),
            service: nextCustomer.services?.name,
            ticket_number: nextCustomer.id.slice(-8).toUpperCase()
          },
          message: 'Next customer called successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'start-service': {
        if (!appointment_id) {
          return new Response(JSON.stringify({ error: 'Appointment ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: updateError } = await supabaseClient
          .from('appointments')
          .update({ 
            status: 'in_progress',
            start_time: new Date().toISOString(),
            staff_id: staff_id
          })
          .eq('id', appointment_id)
          .eq('status', 'checked_in');

        if (updateError) {
          console.error('Error starting service:', updateError);
          return new Response(JSON.stringify({ 
            error: 'Failed to start service' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          action: 'start-service',
          appointment_id: appointment_id,
          message: 'Service started successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'complete-service': {
        if (!appointment_id) {
          return new Response(JSON.stringify({ error: 'Appointment ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: updateError } = await supabaseClient
          .from('appointments')
          .update({ 
            status: 'completed',
            end_time: new Date().toISOString()
          })
          .eq('id', appointment_id)
          .eq('status', 'in_progress');

        if (updateError) {
          console.error('Error completing service:', updateError);
          return new Response(JSON.stringify({ 
            error: 'Failed to complete service' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          action: 'complete-service',
          appointment_id: appointment_id,
          message: 'Service completed successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'mark-no-show': {
        if (!appointment_id) {
          return new Response(JSON.stringify({ error: 'Appointment ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: updateError } = await supabaseClient
          .from('appointments')
          .update({ 
            status: 'no_show',
            end_time: new Date().toISOString()
          })
          .eq('id', appointment_id)
          .in('status', ['checked_in', 'in_progress']);

        if (updateError) {
          console.error('Error marking no-show:', updateError);
          return new Response(JSON.stringify({ 
            error: 'Failed to mark as no-show' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          action: 'mark-no-show',
          appointment_id: appointment_id,
          message: 'Marked as no-show successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default: {
        return new Response(JSON.stringify({ 
          error: `Unknown action: ${action}. Supported actions: call-next, start-service, complete-service, mark-no-show` 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

  } catch (error) {
    console.error('Error in queue-actions function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
