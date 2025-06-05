
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceCallRequest {
  notification_id: string;
  phone_number: string;
  message: string;
  voice_id: string;
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

    const { notification_id, phone_number, message, voice_id }: VoiceCallRequest = await req.json();

    console.log(`Processing voice call for notification ${notification_id} to ${phone_number}`);

    // Step 1: Generate speech audio using ElevenLabs
    const audioContent = await generateSpeech(message, voice_id);
    
    if (!audioContent) {
      throw new Error('Failed to generate speech audio');
    }

    // Step 2: Make the voice call using Twilio
    const callResult = await makeVoiceCall(phone_number, audioContent);

    // Step 3: Update notification status based on call result
    let status = 'completed';
    let errorMessage = null;
    let callDuration = null;

    if (callResult.success) {
      status = callResult.answered ? 'completed' : 'no_answer';
      callDuration = callResult.duration;
    } else {
      status = 'failed';
      errorMessage = callResult.error;

      // Increment retry count for failed calls
      await supabaseClient
        .from('voice_notifications')
        .update({ 
          retry_count: supabaseClient.rpc('increment_retry_count', { notification_id }) 
        })
        .eq('id', notification_id);
    }

    // Update notification status
    await supabaseClient
      .from('voice_notifications')
      .update({
        status,
        call_duration: callDuration,
        completed_at: new Date().toISOString(),
        error_message: errorMessage
      })
      .eq('id', notification_id);

    // Log the call activity
    await supabaseClient
      .from('notification_logs')
      .insert({
        customer_id: callResult.customerId,
        channel: 'voice',
        message: message,
        status,
        error_message: errorMessage,
        sent_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({ 
      success: callResult.success,
      status,
      call_duration: callDuration,
      message: callResult.success ? 'Voice call completed successfully' : 'Voice call failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in make-voice-call function:', error);
    
    // Update notification as failed
    if (req.json) {
      try {
        const { notification_id } = await req.json();
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        );
        
        await supabaseClient
          .from('voice_notifications')
          .update({
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', notification_id);
      } catch (updateError) {
        console.error('Failed to update notification status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

async function generateSpeech(text: string, voiceId: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || ''
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      console.error('ElevenLabs API error:', await response.text());
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    return base64Audio;
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
}

async function makeVoiceCall(phoneNumber: string, audioContent: string): Promise<{
  success: boolean;
  answered?: boolean;
  duration?: number;
  error?: string;
  customerId?: string;
}> {
  try {
    // For demo purposes, we'll simulate a successful call
    // In production, you would integrate with Twilio or another voice service
    
    console.log(`Simulating voice call to ${phoneNumber}`);
    
    // Simulate call processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate call outcome (80% success rate for demo)
    const isSuccessful = Math.random() > 0.2;
    const isAnswered = isSuccessful && Math.random() > 0.3;
    const duration = isAnswered ? Math.floor(Math.random() * 60) + 10 : 0;

    if (!isSuccessful) {
      return {
        success: false,
        error: 'Network error or invalid phone number'
      };
    }

    return {
      success: true,
      answered: isAnswered,
      duration: duration,
      customerId: 'demo-customer-id'
    };

    // Real Twilio integration would look like this:
    /*
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'To': phoneNumber,
        'From': fromNumber,
        'Url': 'https://your-twiml-url.com/voice-message', // TwiML URL that plays the audio
        'StatusCallback': 'https://your-callback-url.com/call-status'
      }),
    });

    const result = await response.json();
    return {
      success: response.ok,
      callSid: result.sid,
      error: response.ok ? undefined : result.message
    };
    */

  } catch (error) {
    console.error('Error making voice call:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

serve(handler);
