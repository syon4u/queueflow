
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface StaffNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
  expires_at: string;
}

export const useStaffNotifications = () => {
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch notifications
  const { data: notificationData, isLoading } = useQuery({
    queryKey: ['staff-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('staff_notification_queue')
        .select('*')
        .eq('staff_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('staff-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'staff_notification_queue',
          filter: `staff_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as StaffNotification;
          
          // Show browser notification for important types
          if (['check_in', 'service_time_alert', 'customer_waiting'].includes(newNotification.type)) {
            toast({
              title: newNotification.title,
              description: newNotification.message
            });

            // Browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.ico'
              });
            }
          }

          queryClient.invalidateQueries({ queryKey: ['staff-notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, queryClient]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('staff_notification_queue')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['staff-notifications'] });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('staff_notification_queue')
        .update({ read: true })
        .eq('staff_id', user.id)
        .eq('read', false);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['staff-notifications'] });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    if (notificationData) {
      setNotifications(notificationData);
    }
  }, [notificationData]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead
  };
};
