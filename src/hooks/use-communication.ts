
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SendCommunicationParams {
  customerId: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  templateId?: string;
}

export const useCommunication = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendCommunication = async (params: SendCommunicationParams) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-communication', {
        body: params
      });

      if (error) {
        throw error;
      }

      toast({
        title: t('common.success'),
        description: t('communication.sent'),
      });

      return data;
    } catch (error) {
      console.error('Error sending communication:', error);
      toast({
        title: t('common.error'),
        description: t('communication.sendError'),
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendCommunication,
    isLoading
  };
};
