
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  name: string;
  trigger_type: 'time_based' | 'status_change' | 'queue_position' | 'wait_time';
  trigger_condition: string;
  channels: string[];
  template_id: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface NotificationLog {
  id: string;
  customer_id: string;
  appointment_id: string;
  rule_id: string;
  channel: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at: string;
  retry_count: number;
  error_message?: string;
}

interface SmartNotificationTrigger {
  appointmentId: string;
  customerId: string;
  triggerType: string;
  triggerData: any;
}

export function useSmartNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get notification rules
  const { data: notificationRules, isLoading: rulesLoading } = useQuery({
    queryKey: ['notification-rules'],
    queryFn: async (): Promise<NotificationRule[]> => {
      const { data, error } = await supabase
        .from('notification_rules')
        .select('*')
        .eq('enabled', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Get notification history
  const { data: notificationHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['notification-history'],
    queryFn: async (): Promise<NotificationLog[]> => {
      const { data, error } = await supabase
        .from('notification_logs')
        .select(`
          *,
          customers!notification_logs_customer_id_fkey(first_name, last_name),
          appointments!notification_logs_appointment_id_fkey(scheduled_time)
        `)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    }
  });

  // Process notification triggers
  const processNotificationTrigger = async (trigger: SmartNotificationTrigger) => {
    if (isProcessing || !notificationRules) return;

    setIsProcessing(true);
    
    try {
      // Find applicable rules for this trigger
      const applicableRules = notificationRules.filter(rule => {
        return rule.trigger_type === trigger.triggerType && rule.enabled;
      });

      for (const rule of applicableRules) {
        // Check if condition is met
        const conditionMet = await evaluateCondition(rule, trigger);
        
        if (conditionMet) {
          await sendNotification(rule, trigger);
        }
      }
    } catch (error) {
      console.error('Error processing notification trigger:', error);
      toast({
        title: 'Notification Error',
        description: 'Failed to process notification trigger.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Evaluate if a rule condition is met
  const evaluateCondition = async (rule: NotificationRule, trigger: SmartNotificationTrigger): Promise<boolean> => {
    switch (rule.trigger_type) {
      case 'time_based':
        return evaluateTimeTrigger(rule.trigger_condition, trigger);
      case 'status_change':
        return evaluateStatusTrigger(rule.trigger_condition, trigger);
      case 'queue_position':
        return evaluateQueueTrigger(rule.trigger_condition, trigger);
      case 'wait_time':
        return evaluateWaitTimeTrigger(rule.trigger_condition, trigger);
      default:
        return false;
    }
  };

  const evaluateTimeTrigger = (condition: string, trigger: SmartNotificationTrigger): boolean => {
    // Parse condition like "24 hours before appointment"
    const match = condition.match(/(\d+)\s+(hours?|minutes?)\s+before/);
    if (!match) return false;

    const [, amount, unit] = match;
    const timeAmount = parseInt(amount);
    const now = new Date();
    const appointmentTime = new Date(trigger.triggerData.scheduledTime);
    
    const diffMs = appointmentTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffMinutes = diffMs / (1000 * 60);

    if (unit.startsWith('hour')) {
      return Math.abs(diffHours - timeAmount) < 0.5; // Within 30 minutes
    } else if (unit.startsWith('minute')) {
      return Math.abs(diffMinutes - timeAmount) < 5; // Within 5 minutes
    }
    
    return false;
  };

  const evaluateStatusTrigger = (condition: string, trigger: SmartNotificationTrigger): boolean => {
    // Parse condition like "Status changes to 'called'"
    const match = condition.match(/Status changes to ['"](.+)['"]/) || 
                  condition.match(/status\s*=\s*['"](.+)['"]/i);
    if (!match) return false;

    const expectedStatus = match[1];
    return trigger.triggerData.newStatus === expectedStatus;
  };

  const evaluateQueueTrigger = (condition: string, trigger: SmartNotificationTrigger): boolean => {
    // Parse condition like "Position changes to #3 or less"
    const match = condition.match(/Position.*?#?(\d+)\s+or\s+less/) ||
                  condition.match(/position\s*<=?\s*(\d+)/i);
    if (!match) return false;

    const maxPosition = parseInt(match[1]);
    return trigger.triggerData.queuePosition <= maxPosition;
  };

  const evaluateWaitTimeTrigger = (condition: string, trigger: SmartNotificationTrigger): boolean => {
    // Parse condition like "Wait time exceeds 30 minutes"
    const match = condition.match(/Wait time exceeds (\d+)\s+(minutes?|hours?)/) ||
                  condition.match(/wait.*?(\d+)\s*(min|hour)/i);
    if (!match) return false;

    const [, amount, unit] = match;
    const threshold = parseInt(amount);
    const waitTimeMinutes = trigger.triggerData.waitTimeMinutes;

    if (unit.startsWith('hour')) {
      return waitTimeMinutes >= (threshold * 60);
    } else {
      return waitTimeMinutes >= threshold;
    }
  };

  // Send notification using the rule
  const sendNotification = async (rule: NotificationRule, trigger: SmartNotificationTrigger) => {
    try {
      // Get customer details
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', trigger.customerId)
        .single();

      if (!customer) return;

      // Send via each channel
      for (const channel of rule.channels) {
        const { error } = await supabase.functions.invoke('send-communication', {
          body: {
            customer_id: trigger.customerId,
            channel,
            template_id: rule.template_id,
            appointment_id: trigger.appointmentId,
            priority: rule.priority,
            rule_id: rule.id
          }
        });

        if (error) {
          console.error(`Failed to send ${channel} notification:`, error);
        }
      }

      // Log the notification attempt
      await supabase
        .from('notification_logs')
        .insert({
          customer_id: trigger.customerId,
          appointment_id: trigger.appointmentId,
          rule_id: rule.id,
          channel: rule.channels.join(', '),
          message: `Triggered by ${rule.trigger_type}`,
          status: 'sent',
          sent_at: new Date().toISOString()
        });

      // Refresh notification history
      queryClient.invalidateQueries({ queryKey: ['notification-history'] });
      
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Create or update notification rule
  const saveNotificationRule = async (rule: Partial<NotificationRule>) => {
    try {
      const { error } = await supabase
        .from('notification_rules')
        .upsert(rule);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
      
      toast({
        title: 'Success',
        description: 'Notification rule saved successfully.',
      });
    } catch (error) {
      console.error('Error saving notification rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification rule.',
        variant: 'destructive'
      });
    }
  };

  // Delete notification rule
  const deleteNotificationRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('notification_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
      
      toast({
        title: 'Success',
        description: 'Notification rule deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting notification rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification rule.',
        variant: 'destructive'
      });
    }
  };

  return {
    notificationRules,
    notificationHistory,
    rulesLoading,
    historyLoading,
    isProcessing,
    processNotificationTrigger,
    saveNotificationRule,
    deleteNotificationRule
  };
}
