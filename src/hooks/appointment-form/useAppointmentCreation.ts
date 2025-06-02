
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppointmentFormData } from './types';

export const useAppointmentCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createAppointment = useMutation({
    mutationFn: async (appointmentData: AppointmentFormData) => {
      console.log('useAppointmentCreation - Creating appointment:', appointmentData);
      
      if (!user?.email) {
        throw new Error('User email not found');
      }

      // Check if customer exists
      let customerId;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const customerUuid = crypto.randomUUID();
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: customerUuid,
            first_name: user.user_metadata?.first_name || 'Customer',
            last_name: user.user_metadata?.last_name || 'User',
            email: user.email,
            phone: user.user_metadata?.phone
          });

        if (customerError) throw customerError;
        customerId = customerUuid;
      }

      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: appointmentData.service_id,
          location_id: appointmentData.location_id,
          scheduled_time: appointmentData.scheduled_time,
          reason_for_visit: appointmentData.reason_for_visit,
          notes: appointmentData.notes,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('useAppointmentCreation - Appointment created successfully:', data);
      toast({
        title: t('common.success'),
        description: t('appointments.created'),
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      navigate('/customer');
    },
    onError: (error) => {
      console.error('useAppointmentCreation - Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.createError'),
        variant: 'destructive',
      });
    },
  });

  return {
    createAppointment: createAppointment.mutate,
    isSubmitting: createAppointment.isPending
  };
};
