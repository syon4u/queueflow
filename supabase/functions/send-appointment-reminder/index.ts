
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReminderRequest {
  reminder_id: string;
  appointment_id: string;
  reminder_type: 'initial' | 'follow_up' | 'final' | 'same_day';
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

    const { reminder_id, appointment_id, reminder_type }: ReminderRequest = await req.json();

    // Get appointment and customer details
    const { data: appointment, error: appointmentError } = await supabaseClient
      .from('appointments')
      .select(`
        *,
        customers!appointments_customer_id_fkey(*),
        services!appointments_service_id_fkey(name),
        locations!appointments_location_id_fkey(name, address)
      `)
      .eq('id', appointment_id)
      .single();

    if (appointmentError || !appointment) {
      return new Response(JSON.stringify({ error: 'Appointment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get customer preferences (default to email and SMS)
    const customerPreferences = {
      sms_reminders: true,
      email_reminders: true,
      voice_reminders: false
    };

    // Generate reminder message based on type
    const message = generateReminderMessage(reminder_type, appointment);
    const subject = generateReminderSubject(reminder_type, appointment);

    // Send via preferred channels
    const results = [];

    if (customerPreferences.email_reminders && appointment.customers.email) {
      try {
        const emailResult = await supabaseClient.functions.invoke('send-communication', {
          body: {
            customerId: appointment.customer_id,
            type: 'email',
            subject: subject,
            message: message,
            templateId: 'appointment-reminder'
          }
        });
        results.push({ channel: 'email', success: !emailResult.error });
      } catch (error) {
        console.error('Email reminder failed:', error);
        results.push({ channel: 'email', success: false, error: error.message });
      }
    }

    if (customerPreferences.sms_reminders && appointment.customers.phone) {
      try {
        const smsResult = await supabaseClient.functions.invoke('send-communication', {
          body: {
            customerId: appointment.customer_id,
            type: 'sms',
            message: message,
            templateId: 'appointment-reminder-sms'
          }
        });
        results.push({ channel: 'sms', success: !smsResult.error });
      } catch (error) {
        console.error('SMS reminder failed:', error);
        results.push({ channel: 'sms', success: false, error: error.message });
      }
    }

    // Log the reminder activity
    await supabaseClient
      .from('notification_logs')
      .insert({
        customer_id: appointment.customer_id,
        appointment_id: appointment_id,
        channel: results.map(r => r.channel).join(', '),
        message: message,
        status: results.some(r => r.success) ? 'sent' : 'failed',
        sent_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      message: 'Reminder sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-appointment-reminder function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

function generateReminderMessage(type: string, appointment: any): string {
  const customerName = `${appointment.customers.first_name} ${appointment.customers.last_name}`;
  const appointmentTime = new Date(appointment.scheduled_time).toLocaleString();
  const serviceName = appointment.services?.name || 'appointment';
  const locationName = appointment.locations?.name || 'our location';

  switch (type) {
    case 'initial':
      return `Hi ${customerName}, this is a reminder that you have an upcoming ${serviceName} appointment scheduled for ${appointmentTime} at ${locationName}. Please mark your calendar and let us know if you need to reschedule.`;
      
    case 'follow_up':
      return `Hello ${customerName}, just a friendly reminder about your ${serviceName} appointment tomorrow at ${appointmentTime}. We look forward to seeing you at ${locationName}.`;
      
    case 'same_day':
      return `Hi ${customerName}, your ${serviceName} appointment is today at ${appointmentTime} at ${locationName}. Please arrive a few minutes early.`;
      
    case 'final':
      return `${customerName}, your ${serviceName} appointment is in 30 minutes at ${locationName}. Please head over soon!`;
      
    default:
      return `Hi ${customerName}, reminder about your ${serviceName} appointment on ${appointmentTime} at ${locationName}.`;
  }
}

function generateReminderSubject(type: string, appointment: any): string {
  const serviceName = appointment.services?.name || 'appointment';
  
  switch (type) {
    case 'initial':
      return `Upcoming ${serviceName} Appointment Reminder`;
    case 'follow_up':
      return `Tomorrow's ${serviceName} Appointment`;
    case 'same_day':
      return `Today's ${serviceName} Appointment`;
    case 'final':
      return `${serviceName} Appointment in 30 Minutes`;
    default:
      return `Appointment Reminder`;
  }
}

serve(handler);
