
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

interface VariableContext {
  customer_name?: string;
  first_name?: string;
  last_name?: string;
  appointment_time?: string;
  service_name?: string;
  location_name?: string;
  queue_position?: string;
  estimated_wait?: string;
}

const replaceTemplateVariables = (text: string, context: VariableContext): string => {
  if (!text) return text;
  
  let result = text;
  
  // Replace customer variables
  if (context.customer_name) {
    result = result.replace(/\{\{customer_name\}\}/g, context.customer_name);
  }
  if (context.first_name) {
    result = result.replace(/\{\{first_name\}\}/g, context.first_name);
  }
  if (context.last_name) {
    result = result.replace(/\{\{last_name\}\}/g, context.last_name);
  }
  
  // Replace appointment variables
  if (context.appointment_time) {
    result = result.replace(/\{\{appointment_time\}\}/g, context.appointment_time);
  }
  if (context.service_name) {
    result = result.replace(/\{\{service_name\}\}/g, context.service_name);
  }
  if (context.location_name) {
    result = result.replace(/\{\{location_name\}\}/g, context.location_name);
  }
  
  // Replace queue variables
  if (context.queue_position) {
    result = result.replace(/\{\{queue_position\}\}/g, context.queue_position);
  }
  if (context.estimated_wait) {
    result = result.replace(/\{\{estimated_wait\}\}/g, context.estimated_wait);
  }
  
  return result;
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

    // Build variable context for replacement
    const variableContext: VariableContext = {
      customer_name: `${customer.first_name} ${customer.last_name}`.trim(),
      first_name: customer.first_name,
      last_name: customer.last_name
      // Additional context could be added here (appointment details, etc.)
    };

    // Apply variable replacement to message and subject
    const processedMessage = replaceTemplateVariables(message, variableContext);
    const processedSubject = subject ? replaceTemplateVariables(subject, variableContext) : undefined;

    let communicationResult;
    let status = 'sent';

    if (type === 'email' && customer.email) {
      try {
        const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
        
        const emailResponse = await resend.emails.send({
          from: 'Queue Management <onboarding@resend.dev>',
          to: [customer.email],
          subject: processedSubject || 'Message from Queue Management System',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Message from Queue Management System</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${processedMessage}</p>
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
      console.log(`SMS would be sent to ${customer.phone}: ${processedMessage}`);
      communicationResult = { success: true, method: 'sms', note: 'SMS logging only (no provider configured)' };
    } else {
      return new Response(JSON.stringify({ error: 'Customer contact information not available for selected method' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log communication in database (with processed content)
    const { error: logError } = await supabaseClient
      .from('customer_communications')
      .insert({
        customer_id: customerId,
        staff_id: user.id,
        type,
        subject: processedSubject,
        message: processedMessage,
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
