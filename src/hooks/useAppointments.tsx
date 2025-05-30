
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Appointment } from '@/components/appointments/AppointmentList';

export const useCustomerAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAppointments = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          scheduled_time,
          check_in_time,
          start_time,
          end_time,
          service:service_id (name, duration),
          location:location_id (name)
        `)
        .eq('customer_id', user.id)
        .order('scheduled_time', { ascending: false });
        
      if (error) throw error;
      
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.errorFetching'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setAppointments(prev => prev.map(appt => 
        appt.id === id ? { ...appt, status: 'cancelled' } : appt
      ));
      
      toast({
        title: t('appointments.cancelled'),
        description: t('appointments.appointmentCancelled')
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.errorCancelling'),
        variant: 'destructive'
      });
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);
  
  return {
    appointments,
    isLoading,
    cancelAppointment,
    refreshAppointments: fetchAppointments
  };
};
