
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const sendConfirmationNotifications = async (
    customerId: string, 
    confirmationCode: string, 
    customerData: { email?: string | null; phone?: string | null }
  ) => {
    try {
      // Send email notification if customer has email
      if (customerData.email) {
        await supabase.functions.invoke('send-communication', {
          body: {
            customerId: customerId,
            type: 'email',
            subject: 'Appointment Confirmation',
            message: `Your appointment has been confirmed! Your confirmation code is: ${confirmationCode}. Please keep this code for check-in and status updates.`,
          }
        });
      }

      // Send SMS notification if customer has phone
      if (customerData.phone) {
        await supabase.functions.invoke('send-communication', {
          body: {
            customerId: customerId,
            type: 'sms',
            message: `Your appointment is confirmed! Confirmation code: ${confirmationCode}. Keep this code for check-in.`,
          }
        });
      }

      // Show success message based on what was sent
      const notificationMethods = [];
      if (customerData.email) notificationMethods.push('email');
      if (customerData.phone) notificationMethods.push('SMS');
      
      if (notificationMethods.length > 0) {
        toast({
          title: t('common.success'),
          description: `Confirmation sent via ${notificationMethods.join(' and ')}`,
        });
      }
    } catch (error) {
      console.error('Error sending confirmation notifications:', error);
      toast({
        title: t('common.warning'),
        description: 'Appointment created but confirmation notifications may not have been sent.',
        variant: "destructive",
      });
    }
  };

  return { sendConfirmationNotifications };
};
