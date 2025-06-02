
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Customer } from '@/components/customer/CustomerSearchBox';
import { NewCustomerFormValues, ExistingCustomerFormValues, AppointmentStep } from './types';

export const useAppointmentSubmission = (onAppointmentScheduled: (code: string) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitNewCustomerAppointment = async (
    data: NewCustomerFormValues,
    selectedDate: Date | undefined,
    selectedTime: string,
    setIsSubmittingState: (submitting: boolean) => void,
    setStep: (step: AppointmentStep) => void
  ) => {
    if (!selectedDate) {
      toast({
        title: 'Error',
        description: 'Please select a date for your appointment.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingState(true);
    console.log('useAppointmentSubmission - Creating appointment for new customer:', data);

    try {
      // Parse the time and create the scheduled datetime
      const [time, modifier] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours, 10);
      
      if (modifier === 'PM' && hour !== 12) {
        hour += 12;
      } else if (modifier === 'AM' && hour === 12) {
        hour = 0;
      }

      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(hour, parseInt(minutes, 10), 0, 0);

      // Split name into first and last name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create customer first
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone: data.phone,
          email: data.email || null,
        })
        .select('id')
        .single();

      if (customerError) {
        console.error('useAppointmentSubmission - Customer creation error:', customerError);
        throw new Error(`Failed to create customer: ${customerError.message}`);
      }

      // Create appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerData.id,
          location_id: data.location_id,
          service_id: data.service_id,
          scheduled_time: scheduledDateTime.toISOString(),
          reason_for_visit: data.reason_for_visit || null,
          status: 'scheduled',
        })
        .select('id')
        .single();

      if (appointmentError) {
        console.error('useAppointmentSubmission - Appointment creation error:', appointmentError);
        throw new Error(`Failed to create appointment: ${appointmentError.message}`);
      }

      const confirmationCode = `APT-${appointmentData.id.slice(0, 8).toUpperCase()}`;
      
      toast({
        title: 'Success!',
        description: 'Your appointment has been scheduled successfully.',
      });

      onAppointmentScheduled(confirmationCode);
    } catch (error: any) {
      console.error('useAppointmentSubmission - Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingState(false);
    }
  };

  const submitExistingCustomerAppointment = async (
    data: ExistingCustomerFormValues,
    selectedDate: Date | undefined,
    selectedTime: string,
    selectedCustomer: Customer | null,
    setIsSubmittingState: (submitting: boolean) => void,
    setStep: (step: AppointmentStep) => void
  ) => {
    if (!selectedDate || !selectedCustomer) {
      toast({
        title: 'Error',
        description: 'Please select a date and customer for the appointment.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingState(true);
    console.log('useAppointmentSubmission - Creating appointment for existing customer:', selectedCustomer.id);

    try {
      // Parse the time and create the scheduled datetime
      const [time, modifier] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours, 10);
      
      if (modifier === 'PM' && hour !== 12) {
        hour += 12;
      } else if (modifier === 'AM' && hour === 12) {
        hour = 0;
      }

      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(hour, parseInt(minutes, 10), 0, 0);

      // Create appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: selectedCustomer.id,
          location_id: data.location_id,
          service_id: data.service_id,
          scheduled_time: scheduledDateTime.toISOString(),
          reason_for_visit: data.reason_for_visit || null,
          status: 'scheduled',
        })
        .select('id')
        .single();

      if (appointmentError) {
        console.error('useAppointmentSubmission - Appointment creation error:', appointmentError);
        throw new Error(`Failed to create appointment: ${appointmentError.message}`);
      }

      const confirmationCode = `APT-${appointmentData.id.slice(0, 8).toUpperCase()}`;
      
      toast({
        title: 'Success!',
        description: 'Your appointment has been scheduled successfully.',
      });

      onAppointmentScheduled(confirmationCode);
    } catch (error: any) {
      console.error('useAppointmentSubmission - Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingState(false);
    }
  };

  return {
    submitNewCustomerAppointment,
    submitExistingCustomerAppointment,
  };
};
