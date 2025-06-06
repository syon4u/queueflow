
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
      
      let appointmentId: string | null = null;

      // Handle customer confirmation codes (CUST-XXXXXXXX)
      if (confirmation_code.startsWith('CUST-')) {
        const { data: customerData, error: customerError } = await supabaseClient
          .from('customers')
          .select(`
            id,
            appointments!appointments_customer_id_fkey(
              id,
              status,
              scheduled_time
            )
          `)
          .eq('confirmation_number', confirmation_code)
          .maybeSingle();

        if (customerError) {
          console.error('Customer lookup error:', customerError);
          return new Response(JSON.stringify({ 
            error: 'Database error occurred' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (customerData && customerData.appointments && customerData.appointments.length > 0) {
          // Find the most recent scheduled appointment (within the last 7 days to next 7 days)
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

          const validAppointment = customerData.appointments.find(apt => {
            const aptDate = new Date(apt.scheduled_time);
            return apt.status === 'scheduled' && 
                   aptDate >= weekAgo && 
                   aptDate <= weekFromNow;
          });

          if (validAppointment) {
            appointmentId = validAppointment.id;
          }
        }
      } 
      // Handle appointment codes (APT-XXXXXXXX)
      else if (confirmation_code.startsWith('APT-')) {
        const appointmentIdPrefix = confirmation_code.substring(4).toLowerCase();
        
        // Look for appointments within a broader time range (last 7 days to next 7 days)
        const { data: appointments, error: searchError } = await supabaseClient
          .from('appointments')
          .select('id, status, scheduled_time')
          .eq('status', 'scheduled')
          .gte('scheduled_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .lte('scheduled_time', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

        if (searchError) {
          console.error('Error searching for appointment:', searchError);
          return new Response(JSON.stringify({ 
            error: 'Database error occurred' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const matchingAppointment = appointments?.find(apt => 
          apt.id.toLowerCase().startsWith(appointmentIdPrefix)
        );

        if (matchingAppointment) {
          appointmentId = matchingAppointment.id;
        }
      } else {
        return new Response(JSON.stringify({ 
          error: 'Invalid confirmation code format. Use CUST-XXXXXXXX or APT-XXXXXXXX format.' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!appointmentId) {
        return new Response(JSON.stringify({ 
          error: 'No scheduled appointment found with the provided confirmation code' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get appointment details for confirmation
      const { data: appointment, error: appointmentError } = await supabaseClient
        .from('appointments')
        .select(`
          id,
          status,
          customers!appointments_customer_id_fkey(first_name, last_name)
        `)
        .eq('id', appointmentId)
        .single();

      if (appointmentError || !appointment) {
        console.error('Appointment details error:', appointmentError);
        return new Response(JSON.stringify({ 
          error: 'Failed to retrieve appointment details' 
        }), {
          status: 500,
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
        .eq('id', appointmentId);

      if (updateError) {
        console.error('Error updating appointment:', updateError);
        return new Response(JSON.stringify({ 
          error: 'Failed to check in' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Successfully checked in appointment: ${appointmentId}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Check-in successful',
        confirmation_code,
        appointment_id: appointmentId,
        customer_name: `${appointment.customers?.first_name} ${appointment.customers?.last_name}`.trim()
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
