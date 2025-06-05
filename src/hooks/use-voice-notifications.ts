
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceNotification {
  id: string;
  customer_id: string;
  appointment_id?: string;
  phone_number: string;
  message: string;
  voice_id: string;
  status: 'pending' | 'calling' | 'completed' | 'failed' | 'no_answer' | 'busy';
  call_duration?: number;
  retry_count: number;
  max_retries: number;
  scheduled_for: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
}

interface VoiceCallRequest {
  customerId: string;
  appointmentId?: string;
  phoneNumber: string;
  message: string;
  voiceId?: string;
  scheduledFor?: string;
  maxRetries?: number;
}

export function useVoiceNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get all voice notifications
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['voice-notifications'],
    queryFn: async (): Promise<VoiceNotification[]> => {
      const { data, error } = await supabase
        .from('voice_notifications')
        .select(`
          *,
          customers!voice_notifications_customer_id_fkey(first_name, last_name),
          appointments!voice_notifications_appointment_id_fkey(scheduled_time)
        `)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      
      return data || [];
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Get pending voice notifications
  const { data: pendingNotifications, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-voice-notifications'],
    queryFn: async (): Promise<VoiceNotification[]> => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('voice_notifications')
        .select(`
          *,
          customers!voice_notifications_customer_id_fkey(first_name, last_name, phone),
          appointments!voice_notifications_appointment_id_fkey(scheduled_time)
        `)
        .in('status', ['pending', 'failed'])
        .lte('scheduled_for', now)
        .lt('retry_count', 3); // Only get notifications that haven't exceeded max retries

      if (error) throw error;
      
      return data || [];
    },
    refetchInterval: 15000 // Check every 15 seconds
  });

  // Schedule a voice call
  const scheduleVoiceCall = async (request: VoiceCallRequest) => {
    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('voice_notifications')
        .insert({
          customer_id: request.customerId,
          appointment_id: request.appointmentId,
          phone_number: request.phoneNumber,
          message: request.message,
          voice_id: request.voiceId || '9BWtsMINqrJLrRacOk9x', // Default Aria voice
          status: 'pending',
          retry_count: 0,
          max_retries: request.maxRetries || 3,
          scheduled_for: request.scheduledFor || new Date().toISOString()
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['voice-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['pending-voice-notifications'] });

      toast({
        title: 'Success',
        description: 'Voice call notification scheduled successfully',
      });

    } catch (error) {
      console.error('Error scheduling voice call:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule voice call notification',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process pending voice notifications
  const processPendingNotifications = async () => {
    if (!pendingNotifications || pendingNotifications.length === 0) return;

    for (const notification of pendingNotifications) {
      try {
        // Update status to calling
        await supabase
          .from('voice_notifications')
          .update({ status: 'calling' })
          .eq('id', notification.id);

        // Make the voice call
        await initiateVoiceCall(notification);
        
      } catch (error) {
        console.error(`Failed to process voice notification ${notification.id}:`, error);
      }
    }

    queryClient.invalidateQueries({ queryKey: ['voice-notifications'] });
    queryClient.invalidateQueries({ queryKey: ['pending-voice-notifications'] });
  };

  // Initiate voice call via edge function
  const initiateVoiceCall = async (notification: VoiceNotification) => {
    const { error } = await supabase.functions.invoke('make-voice-call', {
      body: {
        notification_id: notification.id,
        phone_number: notification.phone_number,
        message: notification.message,
        voice_id: notification.voice_id
      }
    });

    if (error) throw error;
  };

  // Cancel a voice notification
  const cancelVoiceNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('voice_notifications')
        .update({ status: 'failed', error_message: 'Cancelled by user' })
        .eq('id', notificationId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['voice-notifications'] });
      
      toast({
        title: 'Success',
        description: 'Voice notification cancelled',
      });
    } catch (error) {
      console.error('Error cancelling voice notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel voice notification',
        variant: 'destructive'
      });
    }
  };

  // Auto-process pending notifications
  useEffect(() => {
    if (pendingNotifications && pendingNotifications.length > 0) {
      processPendingNotifications();
    }
  }, [pendingNotifications]);

  return {
    notifications,
    pendingNotifications,
    notificationsLoading,
    pendingLoading,
    isProcessing,
    scheduleVoiceCall,
    cancelVoiceNotification,
    processPendingNotifications
  };
}
