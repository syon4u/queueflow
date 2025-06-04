
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TwilioWebhookRequest {
  From: string;
  Body: string;
  MessageSid: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Parse Twilio webhook data
    const formData = await req.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    const messageSid = formData.get('MessageSid') as string;

    console.log(`Received SMS from ${from}: ${body}`);

    // Clean phone number (remove +1 if present)
    const phoneNumber = from.replace('+1', '').replace(/\D/g, '');

    // Process the SMS command
    const response = await processSMSCommand(supabaseClient, phoneNumber, body);

    // Send response back via Twilio
    const twilioResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>${response}</Message>
    </Response>`;

    // Log the interaction
    await supabaseClient
      .from('customer_communications')
      .insert({
        customer_id: null, // We'll need to look this up if needed
        type: 'sms',
        message: `Received: ${body} | Sent: ${response}`,
        status: 'sent'
      });

    return new Response(twilioResponse, {
      headers: {
        'Content-Type': 'text/xml',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>Sorry, we couldn't process your request. Please contact us directly.</Message>
    </Response>`;

    return new Response(errorResponse, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
        ...corsHeaders
      }
    });
  }
};

async function processSMSCommand(supabase: any, phoneNumber: string, message: string): Promise<string> {
  const command = message.trim().toUpperCase();
  
  // Find customer's latest appointment by phone number
  const { data: customers, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('phone', phoneNumber)
    .limit(1);

  if (customerError || !customers?.length) {
    return "We couldn't find your appointment. Please contact us directly for assistance.";
  }

  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .select(`
      *,
      customers!appointments_customer_id_fkey(first_name, last_name),
      services!appointments_service_id_fkey(name),
      locations!appointments_location_id_fkey(name)
    `)
    .eq('customer_id', customers[0].id)
    .eq('status', 'scheduled')
    .gte('scheduled_time', new Date().toISOString())
    .order('scheduled_time', { ascending: true })
    .limit(1)
    .single();

  if (appointmentError || !appointment) {
    return "You don't have any upcoming appointments. Please contact us if you need assistance.";
  }

  // Process commands
  switch (command) {
    case 'R': // Status request
      const scheduledTime = new Date(appointment.scheduled_time);
      return `Your ${appointment.services.name} appointment at ${appointment.locations.name} is scheduled for ${scheduledTime.toLocaleDateString()} at ${scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Status: ${appointment.status}`;

    case 'LATE':
    case 'LATE 5':
    case 'LATE 10':
    case 'LATE 15':
    case 'LATE 20':
    case 'LATE 30':
      const delayMatch = command.match(/LATE\s+(\d+)/);
      const delayMinutes = delayMatch ? parseInt(delayMatch[1]) : 5;
      
      // Update appointment with delay note
      await supabase
        .from('appointments')
        .update({
          notes: `Customer reported ${delayMinutes} minute delay via SMS`
        })
        .eq('id', appointment.id);

      return `Thank you for letting us know. We've noted you'll be ${delayMinutes} minutes late. Please arrive as soon as possible.`;

    case 'CANCEL':
      await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          notes: 'Cancelled by customer via SMS'
        })
        .eq('id', appointment.id);

      return `Your appointment has been cancelled. Thank you for notifying us. You can schedule a new appointment online or by calling us.`;

    default:
      return `Commands: R (status), LATE X (delay X minutes), CANCEL (cancel appointment). Reply with one of these letters.`;
  }
}

serve(handler);
