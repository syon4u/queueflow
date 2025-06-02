
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { NewCustomerFormValues } from './types';

export const useNewCustomerAppointment = (
  onSuccess: (data: NewCustomerFormValues) => void
) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createAppointment = useMutation({
    mutationFn: async ({
      formData,
      selectedDate,
      selectedTime
    }: {
      formData: NewCustomerFormValues;
      selectedDate: Date;
      selectedTime: string;
    }) => {
      console.log('useNewCustomerAppointment - Creating appointment for new customer:', formData);
      
      if (!selectedDate || !selectedTime) {
        throw new Error('Date and time are required');
      }

      // Parse the name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

      // Check if customer already exists by phone or email
      let customerId: string;
      let customerData: any;
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .or(`phone.eq.${formData.phone}${formData.email ? `,email.eq.${formData.email}` : ''}`)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        customerData = existingCustomer;
        console.log('Found existing customer:', customerId);
      } else {
        // For walk-in customers without authentication, generate a UUID
        const customerUuid = crypto.randomUUID();
        
        // Try to insert customer directly
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            id: customerUuid,
            first_name: firstName,
            last_name: lastName,
            phone: formData.phone,
            email: formData.email || null
          })
          .select('*')
          .single();

        if (customerError) {
          console.error('Error creating walk-in customer:', customerError);
          throw customerError;
        }
        
        customerId = newCustomer.id;
        customerData = newCustomer;
        console.log('Created new walk-in customer:', customerId);
      }

      // Create appointment
      const appointmentUuid = crypto.randomUUID();
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      console.log('Creating appointment with ID:', appointmentUuid);
      
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          id: appointmentUuid,
          customer_id: customerId,
          service_id: formData.service_id,
          location_id: formData.location_id,
          scheduled_time: scheduledDateTime.toISOString(),
          reason_for_visit: formData.reason_for_visit,
          status: 'scheduled'
        });

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        throw appointmentError;
      }

      return { customerId: customerId, appointmentId: appointmentUuid };
    },
    onSuccess: (data) => {
      console.log('useNewCustomerAppointment - Appointment created successfully:', data);
      toast({
        title: t('common.success'),
        description: t('appointments.created'),
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Call the original onSubmit to handle any additional logic
      onSuccess({
        name: '',
        phone: '',
        email: '',
        service_id: '',
        location_id: '',
        reason_for_visit: ''
      });
    },
    onError: (error) => {
      console.error('useNewCustomerAppointment - Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('appointments.createError'),
        variant: 'destructive',
      });
    }
  });

  return {
    createAppointment: createAppointment.mutate,
    isSubmitting: createAppointment.isPending
  };
};
