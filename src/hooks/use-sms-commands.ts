
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface SMSCommandResponse {
  command: string;
  response: string;
  appointment?: { id: string };
}

export const useSMSCommands = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const processSMSCommand = async (phoneNumber: string, message: string): Promise<SMSCommandResponse | null> => {
    setIsProcessing(true);
    
    try {
      const command = message.trim().toUpperCase();
      
      // Find customer's latest appointment by phone number
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', phoneNumber)
        .limit(1);

      if (customerError || !customers?.length) {
        return {
          command,
          response: "We couldn't find your appointment. Please contact us directly for assistance."
        };
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
        return {
          command,
          response: "You don't have any upcoming appointments. Please contact us if you need assistance."
        };
      }

      // Process commands
      switch (command) {
        case 'R': // Status request
        {
          const scheduledTime = new Date(appointment.scheduled_time);
          return {
            command,
            response: `Your ${appointment.services.name} appointment at ${appointment.locations.name} is scheduled for ${scheduledTime.toLocaleDateString()} at ${scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Status: ${appointment.status}`,
            appointment
          };
        }

        case 'LATE': // Report delay
        case 'LATE 5':
        case 'LATE 10':
        case 'LATE 15':
        case 'LATE 20':
        case 'LATE 30':
        {
          const delayMatch = command.match(/LATE\s+(\d+)/);
          const delayMinutes = delayMatch ? parseInt(delayMatch[1]) : 5; // Default 5 minutes
          
          // Update appointment with delay note
          await supabase
            .from('appointments')
            .update({
              notes: `Customer reported ${delayMinutes} minute delay via SMS`
            })
            .eq('id', appointment.id);

          return {
            command,
            response: `Thank you for letting us know. We've noted you'll be ${delayMinutes} minutes late. Please arrive as soon as possible.`,
            appointment
          };
        }

        case 'CANCEL': // Cancel appointment
          await supabase
            .from('appointments')
            .update({
              status: 'cancelled',
              notes: 'Cancelled by customer via SMS'
            })
            .eq('id', appointment.id);

          return {
            command,
            response: `Your appointment has been cancelled. Thank you for notifying us. You can schedule a new appointment online or by calling us.`,
            appointment
          };

        default:
          return {
            command,
            response: `Commands: R (status), LATE X (delay X minutes), CANCEL (cancel appointment). Reply with one of these letters.`
          };
      }

    } catch (error) {
      console.error('Error processing SMS command:', error);
      return {
        command: message,
        response: "Sorry, we couldn't process your request. Please try again or contact us directly."
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processSMSCommand,
    isProcessing
  };
};
