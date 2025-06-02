
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

      // Check if customer exists by email
      let customerId;
      const { data: existingCustomer, error: customerSearchError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (customerSearchError) {
        console.error('Error searching for customer:', customerSearchError);
        throw customerSearchError;
      }

      if (existingCustomer) {
        customerId = existingCustomer.id;
        console.log('Found existing customer:', customerId);
      } else {
        // Create new customer using the authenticated user's ID
        console.log('Creating new customer with user ID:', user.id);
        
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: user.id, // Use the authenticated user's ID
            first_name: user.user_metadata?.first_name || 'Customer',
            last_name: user.user_metadata?.last_name || 'User',
            email: user.email,
            phone: user.user_metadata?.phone
          });

        if (customerError) {
          console.error('Error creating customer:', customerError);
          throw customerError;
        }
        
        customerId = user.id;
        console.log('Created new customer:', customerId);
      }

      // Create appointment
      const appointmentUuid = crypto.randomUUID();
      console.log('Creating appointment with ID:', appointmentUuid);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          id: appointmentUuid,
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

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
      
      console.log('Appointment created successfully:', data);
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
        description: error.message || t('appointments.createError'),
        variant: 'destructive',
      });
    },
  });

  return {
    createAppointment: createAppointment.mutate,
    isSubmitting: createAppointment.isPending
  };
};
