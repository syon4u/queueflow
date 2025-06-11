
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { CustomerAppointmentData } from './useSimpleAppointmentForm';

export const useCustomerAppointmentFlow = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAppointment = async (customerData: CustomerAppointmentData): Promise<string | null> => {
    setIsSubmitting(true);
    console.log('Creating appointment for customer:', customerData);

    try {
      // Check if customer exists by phone number
      let customerId: string;
      const { data: existingCustomer, error: searchError } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customerData.phone)
        .maybeSingle();

      if (searchError) {
        console.error('Error searching for existing customer:', searchError);
        throw new Error(`Failed to check customer: ${searchError.message}`);
      }

      if (existingCustomer) {
        customerId = existingCustomer.id;
        console.log('Using existing customer:', customerId);
      } else {
        // Create new customer - split the name into first and last name
        const nameParts = customerData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const newCustomerId = crypto.randomUUID();
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            id: newCustomerId,
            first_name: firstName,
            last_name: lastName,
            phone: customerData.phone,
            email: customerData.email || null,
          })
          .select('id')
          .single();

        if (customerError) {
          console.error('Customer creation error:', customerError);
          throw new Error(`Failed to create customer: ${customerError.message}`);
        }

        customerId = newCustomer.id;
        console.log('Created new customer:', customerId);
      }

      // Create the appointment
      let scheduledDateTime: Date;
      
      if (customerData.preferredDate && customerData.preferredTime) {
        scheduledDateTime = new Date(`${customerData.preferredDate}T${customerData.preferredTime}`);
      } else {
        // Default to next business day at 9 AM
        scheduledDateTime = new Date();
        scheduledDateTime.setDate(scheduledDateTime.getDate() + 1);
        scheduledDateTime.setHours(9, 0, 0, 0);
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          location_id: customerData.locationId,
          service_id: customerData.serviceId,
          scheduled_time: scheduledDateTime.toISOString(),
          reason_for_visit: customerData.reasonForVisit || null,
          notes: customerData.additionalNotes || null,
          status: 'scheduled',
        })
        .select('id')
        .single();

      if (appointmentError) {
        console.error('Appointment creation error:', appointmentError);
        throw new Error(`Failed to create appointment: ${appointmentError.message}`);
      }

      // Generate simple confirmation code
      const confirmationCode = `APT-${appointment.id.slice(0, 8).toUpperCase()}`;
      console.log('Created appointment:', appointment.id, 'with confirmation:', confirmationCode);

      return confirmationCode;
    } catch (error: any) {
      console.error('Appointment creation failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createAppointment,
    isSubmitting,
  };
};
