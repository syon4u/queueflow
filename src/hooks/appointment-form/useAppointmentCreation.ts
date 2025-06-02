
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AppointmentFormData } from './types';

export const useAppointmentCreation = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createAppointment = useMutation({
    mutationFn: async (appointmentData: AppointmentFormData & { customerDetails: { name: string; phone: string; email?: string } }) => {
      console.log('useAppointmentCreation - Creating appointment for anonymous user:', appointmentData);
      
      const { customerDetails, ...appointment } = appointmentData;
      
      // Parse the customer name
      const [firstName, ...lastNameParts] = customerDetails.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      let customerId: string;
      
      // Check if customer already exists by phone
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customerDetails.phone)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        console.log('useAppointmentCreation - Using existing customer:', customerId);
      } else {
        // Generate a UUID for the new customer
        const customerUuid = crypto.randomUUID();
        
        // Create new customer with explicit ID
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            id: customerUuid,
            first_name: firstName,
            last_name: lastName,
            phone: customerDetails.phone,
            email: customerDetails.email || null
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
        console.log('useAppointmentCreation - Created new customer:', customerId);
      }

      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: appointment.service_id,
          location_id: appointment.location_id,
          scheduled_time: appointment.scheduled_time,
          reason_for_visit: appointment.reason_for_visit,
          notes: appointment.notes,
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
