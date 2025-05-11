
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSystemSettings = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch system settings
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      // In a real app, this would fetch from your database
      // For now, we'll return mock data
      return [
        { key: 'system_name', value: 'County Service Center' },
        { key: 'business_hours', value: { start: '08:00', end: '17:00' } },
        { key: 'default_location', value: 'main' },
        { key: 'language', value: 'en' },
        { key: 'queue_settings', value: {
          default_wait_time: 15,
          max_queue_size: 50,
          priority_enabled: true,
          auto_assignment: true
        }},
        { key: 'notification_settings', value: {
          method: 'both',
          email_templates: true,
          sms_templates: true,
          wait_time_threshold: 30
        }},
        { key: 'display_settings', value: {
          theme: 'light',
          show_estimated_time: true,
          show_queue_position: true,
          custom_logo_url: ''
        }}
      ];
    },
  });

  // Update system settings
  const updateSettings = async (newSettings: Record<string, any>, section: string) => {
    setIsUpdating(true);
    
    try {
      // In a real app, this would update the database
      // For now, just simulate a delay and show a toast
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`);
      await refetch();
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Error updating settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return { settings, isLoading, updateSettings, isUpdating };
};
