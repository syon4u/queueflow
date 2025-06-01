
import { Resend } from "npm:resend@2.0.0";
import { CommunicationResult } from './types.ts';

export const sendEmail = async (to: string, subject: string, message: string): Promise<CommunicationResult> => {
  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const emailResponse = await resend.emails.send({
      from: 'Queue Management <onboarding@resend.dev>',
      to: [to],
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

    console.log(`Email sent successfully to ${to}:`, emailResponse);
    return { success: true, method: 'email', id: emailResponse.data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, method: 'email', error: error.message };
  }
};
