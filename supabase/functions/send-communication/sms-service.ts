
import { CommunicationResult } from './types.ts';

export const sendSMS = async (to: string, message: string): Promise<CommunicationResult> => {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error('Missing Twilio credentials');
    return { success: false, method: 'sms', error: 'Twilio credentials not configured' };
  }

  try {
    // Clean the phone number to ensure it's in the correct format
    const cleanedPhoneNumber = to.replace(/\D/g, '');
    const formattedPhoneNumber = cleanedPhoneNumber.startsWith('1') 
      ? `+${cleanedPhoneNumber}` 
      : `+1${cleanedPhoneNumber}`;

    console.log(`Sending SMS to ${formattedPhoneNumber}: ${message}`);

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const body = new URLSearchParams({
      To: formattedPhoneNumber,
      From: twilioPhoneNumber,
      Body: message
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twilio API error:', errorData);
      return { success: false, method: 'sms', error: errorData.message || 'Failed to send SMS' };
    }

    const data = await response.json();
    console.log('SMS sent successfully:', data.sid);
    return { success: true, method: 'sms', id: data.sid };

  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, method: 'sms', error: error.message };
  }
};
