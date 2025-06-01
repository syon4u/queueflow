
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { CommunicationRequest, VariableContext, CommunicationResult } from './types.ts';
import { replaceTemplateVariables } from './variable-replacement.ts';
import { sendSMS } from './sms-service.ts';
import { sendEmail } from './email-service.ts';

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

    let communicationResult: CommunicationResult;
    let status = 'sent';

    if (type === 'email' && customer.email) {
      communicationResult = await sendEmail(
        customer.email, 
        processedSubject || 'Message from Queue Management System', 
        processedMessage
      );
      
      if (!communicationResult.success) {
        status = 'failed';
      }
    } else if (type === 'sms' && customer.phone) {
      communicationResult = await sendSMS(customer.phone, processedMessage);
      
      if (!communicationResult.success) {
        status = 'failed';
      }
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
