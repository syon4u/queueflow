
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommunicationRequest {
  customerId: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  templateId?: string;
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

    const { customerId, type, subject, message, templateId }: CommunicationRequest = await req.json();

    // Get customer details
    const { data: customer, error: customerError } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let communicationResult;

    if (type === 'email' && customer.email) {
      // For now, we'll log the email (you can integrate with Resend later)
      console.log(`Sending email to ${customer.email}: ${subject || 'No Subject'} - ${message}`);
      communicationResult = { success: true, method: 'email' };
    } else if (type === 'sms' && customer.phone) {
      // For now, we'll log the SMS (you can integrate with Twilio later)
      console.log(`Sending SMS to ${customer.phone}: ${message}`);
      communicationResult = { success: true, method: 'sms' };
    } else {
      return new Response(JSON.stringify({ error: 'Customer contact information not available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log communication in database
    const { error: logError } = await supabaseClient
      .from('customer_communications')
      .insert({
        customer_id: customerId,
        staff_id: user.id,
        type,
        subject,
        message,
        template_used: templateId,
        status: 'sent'
      });

    if (logError) {
      console.error('Error logging communication:', logError);
    }

    return new Response(JSON.stringify(communicationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-communication function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
