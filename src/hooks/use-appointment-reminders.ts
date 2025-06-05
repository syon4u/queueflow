
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppointmentReminder {
  id: string;
  appointment_id: string;
  reminder_type: 'initial' | 'follow_up' | 'final' | 'same_day';
  scheduled_for: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  error_message?: string;
  created_at: string;
}

interface ReminderSchedule {
  appointmentId: string;
  customerId: string;
  scheduledTime: string;
  customerPreferences?: {
    sms_reminders: boolean;
    email_reminders: boolean;
    voice_reminders: boolean;
    reminder_timing: '24h' | '12h' | '2h' | '30m';
  };
}

export function useAppointmentReminders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get all reminders
  const { data: reminders, isLoading: remindersLoading } = useQuery({
    queryKey: ['appointment-reminders'],
    queryFn: async (): Promise<AppointmentReminder[]> => {
      const { data, error } = await supabase
        .from('appointment_reminders')
        .select(`
          *,
          appointments!appointment_reminders_appointment_id_fkey(
            scheduled_time,
            customers!appointments_customer_id_fkey(first_name, last_name)
          )
        `)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(reminder => ({
        ...reminder,
        reminder_type: reminder.reminder_type as AppointmentReminder['reminder_type'],
        status: reminder.status as AppointmentReminder['status']
      }));
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Get pending reminders that need to be sent
  const { data: pendingReminders, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-reminders'],
    queryFn: async (): Promise<AppointmentReminder[]> => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('appointment_reminders')
        .select(`
          *,
          appointments!appointment_reminders_appointment_id_fkey(
            scheduled_time,
            customer_id,
            customers!appointments_customer_id_fkey(first_name, last_name, email, phone)
          )
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', now);

      if (error) throw error;
      
      return (data || []).map(reminder => ({
        ...reminder,
        reminder_type: reminder.reminder_type as AppointmentReminder['reminder_type'],
        status: reminder.status as AppointmentReminder['status']
      }));
    },
    refetchInterval: 30000 // Check every 30 seconds
  });

  // Schedule reminders for an appointment
  const scheduleReminders = async (schedule: ReminderSchedule) => {
    setIsProcessing(true);
    
    try {
      const appointmentTime = new Date(schedule.scheduledTime);
      const preferences = schedule.customerPreferences || {
        sms_reminders: true,
        email_reminders: true,
        voice_reminders: false,
        reminder_timing: '24h'
      };

      // Define reminder schedule based on preferences
      const reminderTimes = getReminderSchedule(appointmentTime, preferences.reminder_timing);
      
      const remindersToCreate = [];

      // Create initial reminder (configurable timing)
      if (reminderTimes.initial) {
        remindersToCreate.push({
          appointment_id: schedule.appointmentId,
          reminder_type: 'initial',
          scheduled_for: reminderTimes.initial.toISOString(),
          status: 'pending'
        });
      }

      // Create follow-up reminder (day before)
      if (reminderTimes.followUp) {
        remindersToCreate.push({
          appointment_id: schedule.appointmentId,
          reminder_type: 'follow_up',
          scheduled_for: reminderTimes.followUp.toISOString(),
          status: 'pending'
        });
      }

      // Create same-day reminder
      if (reminderTimes.sameDay) {
        remindersToCreate.push({
          appointment_id: schedule.appointmentId,
          reminder_type: 'same_day',
          scheduled_for: reminderTimes.sameDay.toISOString(),
          status: 'pending'
        });
      }

      // Create final reminder (30 minutes before)
      if (reminderTimes.final) {
        remindersToCreate.push({
          appointment_id: schedule.appointmentId,
          reminder_type: 'final',
          scheduled_for: reminderTimes.final.toISOString(),
          status: 'pending'
        });
      }

      // Insert all reminders
      const { error } = await supabase
        .from('appointment_reminders')
        .insert(remindersToCreate);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['appointment-reminders'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reminders'] });

      toast({
        title: 'Success',
        description: `Scheduled ${remindersToCreate.length} reminders for appointment`,
      });

    } catch (error) {
      console.error('Error scheduling reminders:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment reminders',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process pending reminders
  const processPendingReminders = async () => {
    if (!pendingReminders || pendingReminders.length === 0) return;

    for (const reminder of pendingReminders) {
      try {
        // Send the reminder via the communication system
        await sendReminderNotification(reminder);
        
        // Mark as sent
        await supabase
          .from('appointment_reminders')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', reminder.id);

      } catch (error) {
        console.error(`Failed to send reminder ${reminder.id}:`, error);
        
        // Mark as failed
        await supabase
          .from('appointment_reminders')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', reminder.id);
      }
    }

    queryClient.invalidateQueries({ queryKey: ['appointment-reminders'] });
    queryClient.invalidateQueries({ queryKey: ['pending-reminders'] });
  };

  // Send reminder notification
  const sendReminderNotification = async (reminder: AppointmentReminder) => {
    const { error } = await supabase.functions.invoke('send-appointment-reminder', {
      body: {
        reminder_id: reminder.id,
        appointment_id: reminder.appointment_id,
        reminder_type: reminder.reminder_type
      }
    });

    if (error) throw error;
  };

  // Calculate reminder schedule
  const getReminderSchedule = (appointmentTime: Date, timing: string) => {
    const schedules: Record<string, any> = {};

    switch (timing) {
      case '24h':
        schedules.initial = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
        schedules.followUp = new Date(appointmentTime.getTime() - 12 * 60 * 60 * 1000); // 12 hours before
        break;
      case '12h':
        schedules.initial = new Date(appointmentTime.getTime() - 12 * 60 * 60 * 1000); // 12 hours before
        break;
      case '2h':
        schedules.initial = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
        break;
      case '30m':
        schedules.initial = new Date(appointmentTime.getTime() - 30 * 60 * 1000); // 30 minutes before
        break;
    }

    // Always add same-day reminder (2 hours before) if appointment is more than 2 hours away
    const twoHoursBefore = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
    if (twoHoursBefore > new Date()) {
      schedules.sameDay = twoHoursBefore;
    }

    // Always add final reminder (30 minutes before)
    const thirtyMinsBefore = new Date(appointmentTime.getTime() - 30 * 60 * 1000);
    if (thirtyMinsBefore > new Date()) {
      schedules.final = thirtyMinsBefore;
    }

    return schedules;
  };

  // Cancel reminders for an appointment
  const cancelReminders = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointment_reminders')
        .update({ status: 'cancelled' })
        .eq('appointment_id', appointmentId)
        .eq('status', 'pending');

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['appointment-reminders'] });
      
      toast({
        title: 'Success',
        description: 'Appointment reminders cancelled',
      });
    } catch (error) {
      console.error('Error cancelling reminders:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel reminders',
        variant: 'destructive'
      });
    }
  };

  // Auto-process pending reminders
  useEffect(() => {
    if (pendingReminders && pendingReminders.length > 0) {
      processPendingReminders();
    }
  }, [pendingReminders]);

  return {
    reminders,
    pendingReminders,
    remindersLoading,
    pendingLoading,
    isProcessing,
    scheduleReminders,
    cancelReminders,
    processPendingReminders
  };
}
