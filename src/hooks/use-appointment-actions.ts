
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Appointment, AppointmentStatus } from '@/hooks/use-appointments';

export const useAppointmentActions = (onStatusChange?: () => void) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  
  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    setIsLoading(prev => ({ ...prev, [id]: true }));
    try {
      console.log('Updating appointment status:', { id, status });
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status,
          // Add timestamp updates based on status
          ...(status === 'checked_in' && { check_in_time: new Date().toISOString() }),
          ...(status === 'in_progress' && { start_time: new Date().toISOString() }),
          ...(status === 'completed' && { end_time: new Date().toISOString() })
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Appointment status updated successfully');

      toast({
        title: t('common.success'),
        description: t('appointments.statusUpdated'),
      });

      onStatusChange?.();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.statusUpdateError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return {
    isLoading,
    updateAppointmentStatus
  };
};
