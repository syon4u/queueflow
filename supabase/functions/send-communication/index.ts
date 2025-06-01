
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

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
    let status = 'sent';

    if (type === 'email' && customer.email) {
      try {
        const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
        
        const emailResponse = await resend.emails.send({
          from: 'Queue Management <onboarding@resend.dev>',
          to: [customer.email],
          subject: subject || 'Message from Queue Management System',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Message from Queue Management System</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #666; font-size: 14px;">
                This message was sent to you regarding your queue or appointment.
              </p>
            </div>
          `,
        });

        console.log(`Email sent successfully to ${customer.email}:`, emailResponse);
        communicationResult = { success: true, method: 'email', id: emailResponse.data?.id };
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        status = 'failed';
        communicationResult = { success: false, method: 'email', error: emailError.message };
      }
    } else if (type === 'sms' && customer.phone) {
      // For SMS, we'll log it for now (you can integrate with Twilio later if needed)
      console.log(`SMS would be sent to ${customer.phone}: ${message}`);
      communicationResult = { success: true, method: 'sms', note: 'SMS logging only (no provider configured)' };
    } else {
      return new Response(JSON.stringify({ error: 'Customer contact information not available for selected method' }), {
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
        status
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
