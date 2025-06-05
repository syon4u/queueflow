
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

    if (req.method === 'POST' && req.url.includes('/check-in')) {
      const { confirmation_code } = await req.json();

      if (!confirmation_code) {
        return new Response(JSON.stringify({ error: 'Confirmation code is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Check-in attempt with code: ${confirmation_code}`);
      
      // Extract appointment ID from confirmation code (format: APT-XXXXXXXX)
      if (!confirmation_code.startsWith('APT-')) {
        return new Response(JSON.stringify({ 
          error: 'Invalid confirmation code format' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const appointmentIdPrefix = confirmation_code.substring(4).toLowerCase();
      
      // Find appointment using a proper text search - convert UUID to text and use LIKE
      const { data: appointments, error: searchError } = await supabaseClient
        .from('appointments')
        .select(`
          id, 
          status, 
          scheduled_time, 
          customers!appointments_customer_id_fkey(first_name, last_name)
        `)
        .eq('status', 'scheduled')
        .gte('scheduled_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Within last 24 hours
        .lte('scheduled_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()); // Within next 24 hours

      if (searchError) {
        console.error('Error searching for appointment:', searchError);
        return new Response(JSON.stringify({ 
          error: 'Database error occurred' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Filter appointments client-side to find matching ID prefix
      const matchingAppointment = appointments?.find(apt => 
        apt.id.toLowerCase().startsWith(appointmentIdPrefix)
      );

      if (!matchingAppointment) {
        return new Response(JSON.stringify({ 
          error: 'Invalid confirmation code or appointment not found' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update appointment status to checked_in
      const { error: updateError } = await supabaseClient
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', matchingAppointment.id);

      if (updateError) {
        console.error('Error updating appointment:', updateError);
        return new Response(JSON.stringify({ 
          error: 'Failed to check in' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Successfully checked in appointment: ${matchingAppointment.id}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Check-in successful',
        confirmation_code,
        appointment_id: matchingAppointment.id,
        customer_name: `${matchingAppointment.customers?.first_name} ${matchingAppointment.customers?.last_name}`.trim()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in appointments function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
