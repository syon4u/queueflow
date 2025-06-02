
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewCustomerFormValues, ExistingCustomerFormValues, Customer } from './types';
import { useNotifications } from './useNotifications';
import { useTimeParser } from './useTimeParser';

export const useAppointmentSubmission = (
  onAppointmentScheduled: (code: string) => void
) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { sendConfirmationNotifications } = useNotifications();
  const { parseTimeAndDate } = useTimeParser();

  const submitNewCustomerAppointment = async (
    data: NewCustomerFormValues,
    selectedDate: Date | undefined,
    selectedTime: string,
    setIsSubmitting: (submitting: boolean) => void,
    setStep: (step: 'search' | 'new-customer' | 'existing-customer') => void
  ) => {
    if (!selectedDate) {
      toast({
        title: t('common.error'),
        description: t('appointments.selectDate'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDate = parseTimeAndDate(selectedDate, selectedTime);
      
      const [firstName, ...lastNameParts] = data.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      let customerId: string;
      let customerData: any;
      
      // Check if customer already exists by phone
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', data.phone)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        customerData = existingCustomer;
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
            phone: data.phone,
            email: data.email || null
          })
          .select('*')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
        customerData = newCustomer;

        // Create a user account for the customer if they provided an email
        if (data.email) {
          try {
            // Create auth user (this will trigger the handle_new_user function)
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
              email: data.email,
              email_confirm: true,
              user_metadata: {
                first_name: firstName,
                last_name: lastName,
                phone: data.phone
              }
            });

            if (authError) {
              console.warn('Could not create auth user:', authError);
            } else if (authData.user) {
              // Ensure customer role is set
              await supabase
                .from('user_roles')
                .upsert({
                  user_id: authData.user.id,
                  role: 'customer'
                });
            }
          } catch (error) {
            console.warn('Error creating auth user for customer:', error);
            // Continue without creating auth user - customer record still exists
          }
        }
      }
      
      // Create the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: data.service_id,
          location_id: data.location_id,
          scheduled_time: scheduledDate.toISOString(),
          reason_for_visit: data.reason_for_visit,
          status: 'scheduled'
        })
        .select('id')
        .single();

      if (appointmentError) throw appointmentError;
      
      const confirmationCode = appointment.id;
      
      // Send confirmation notifications
      await sendConfirmationNotifications(customerId, confirmationCode, customerData);
      
      onAppointmentScheduled(confirmationCode);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setStep('search');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitExistingCustomerAppointment = async (
    data: ExistingCustomerFormValues,
    selectedDate: Date | undefined,
    selectedTime: string,
    selectedCustomer: Customer | null,
    setIsSubmitting: (submitting: boolean) => void,
    setStep: (step: 'search' | 'new-customer' | 'existing-customer') => void
  ) => {
    if (!selectedDate || !selectedCustomer) {
      toast({
        title: t('common.error'),
        description: t('appointments.selectDateAndCustomer'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDate = parseTimeAndDate(selectedDate, selectedTime);
      
      // Create the appointment
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: selectedCustomer.id,
          service_id: data.service_id,
          location_id: data.location_id,
          scheduled_time: scheduledDate.toISOString(),
          reason_for_visit: data.reason_for_visit,
          status: 'scheduled'
        })
        .select('id')
        .single();

      if (error) throw error;

      const confirmationCode = appointment.id;
      
      // Send confirmation notifications
      await sendConfirmationNotifications(selectedCustomer.id, confirmationCode, selectedCustomer);

      onAppointmentScheduled(confirmationCode);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setStep('search');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitNewCustomerAppointment,
    submitExistingCustomerAppointment,
  };
};
