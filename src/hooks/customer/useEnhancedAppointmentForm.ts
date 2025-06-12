
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateAppointmentTime } from '@/utils/businessHours';
import { CustomerAppointmentData } from './useSimpleAppointmentForm';

export const useEnhancedAppointmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateDuplicate = async (customerData: CustomerAppointmentData): Promise<boolean> => {
    try {
      // First check if customer exists with same phone/email
      const { data: existingCustomers } = await supabase
        .from('customers')
        .select('id')
        .or(`phone.eq.${customerData.phone},email.eq.${customerData.email}`)
        .limit(1);

      if (!existingCustomers?.length) {
        return true; // No existing customer, no duplicate possible
      }

      const customerId = existingCustomers[0].id;
      const appointmentDateTime = new Date(`${customerData.preferredDate}T${customerData.preferredTime}`);

      // Check for duplicate appointments (same customer, service, and time)
      const { data: duplicateAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('customer_id', customerId)
        .eq('service_id', customerData.serviceId)
        .eq('scheduled_time', appointmentDateTime.toISOString())
        .neq('status', 'cancelled')
        .limit(1);

      return !duplicateAppointments?.length;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return true; // Allow if check fails
    }
  };

  const createAppointmentWithValidation = async (customerData: CustomerAppointmentData) => {
    setIsSubmitting(true);

    try {
      // Validate appointment time
      const appointmentDateTime = new Date(`${customerData.preferredDate}T${customerData.preferredTime}`);
      const timeValidation = validateAppointmentTime(appointmentDateTime);
      
      if (!timeValidation.isValid) {
        toast({
          title: 'Invalid Appointment Time',
          description: timeValidation.message,
          variant: 'destructive',
        });
        return null;
      }

      // Check for duplicates
      const isDuplicateValid = await validateDuplicate(customerData);
      if (!isDuplicateValid) {
        toast({
          title: 'Duplicate Appointment',
          description: 'You already have an appointment for this service at this time.',
          variant: 'destructive',
        });
        return null;
      }

      // Create or find customer
      let customerId: string;
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id, confirmation_number')
        .or(`phone.eq.${customerData.phone},email.eq.${customerData.email}`)
        .limit(1)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer - split the name into first and last name
        const nameParts = customerData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            first_name: firstName,
            last_name: lastName,
            phone: customerData.phone,
            email: customerData.email || null,
          })
          .select('id, confirmation_number')
          .single();

        if (customerError || !newCustomer) {
          throw new Error('Failed to create customer record');
        }

        customerId = newCustomer.id;
      }

      // Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          location_id: customerData.locationId,
          service_id: customerData.serviceId,
          scheduled_time: appointmentDateTime.toISOString(),
          reason_for_visit: customerData.reasonForVisit || null,
          notes: customerData.additionalNotes || null,
          status: 'scheduled'
        })
        .select('id')
        .single();

      if (appointmentError || !appointment) {
        throw new Error('Failed to create appointment');
      }

      // Get the customer's confirmation number for response
      const { data: customerWithConfirmation } = await supabase
        .from('customers')
        .select('confirmation_number')
        .eq('id', customerId)
        .single();

      const confirmationCode = customerWithConfirmation?.confirmation_number || 'APT-' + appointment.id.substring(0, 8).toUpperCase();

      toast({
        title: 'Appointment Scheduled!',
        description: `Your appointment has been confirmed. Confirmation code: ${confirmationCode}`,
      });

      return confirmationCode;

    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule appointment. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createAppointmentWithValidation,
    isSubmitting
  };
};
