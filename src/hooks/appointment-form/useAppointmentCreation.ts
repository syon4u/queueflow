
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
}

interface AppointmentData {
  location_id: string;
  service_id: string;
  scheduled_time: string;
  reason_for_visit?: string;
  notes?: string;
  customerDetails: CustomerDetails;
}

export const useAppointmentCreation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const createAppointment = async (appointmentData: AppointmentData) => {
    setIsSubmitting(true);
    console.log('useAppointmentCreation - Creating appointment for anonymous user:', appointmentData);

    try {
      // First, create or find the customer
      const [firstName, ...lastNameParts] = appointmentData.customerDetails.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      // Check if customer exists by phone
      let customerId: string;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', appointmentData.customerDetails.phone)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        console.log('useAppointmentCreation - Using existing customer:', customerId);
      } else {
        // Create new customer
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            first_name: firstName,
            last_name: lastName,
            phone: appointmentData.customerDetails.phone,
            email: appointmentData.customerDetails.email || null,
          })
          .select('id')
          .single();

        if (customerError) {
          console.error('useAppointmentCreation - Customer creation error:', customerError);
          throw new Error(`Failed to create customer: ${customerError.message}`);
        }

        customerId = newCustomer.id;
        console.log('useAppointmentCreation - Created new customer:', customerId);
      }

      // Create the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          location_id: appointmentData.location_id,
          service_id: appointmentData.service_id,
          scheduled_time: appointmentData.scheduled_time,
          reason_for_visit: appointmentData.reason_for_visit || null,
          notes: appointmentData.notes || null,
          status: 'scheduled',
        })
        .select('id')
        .single();

      if (appointmentError) {
        console.error('useAppointmentCreation - Appointment creation error:', appointmentError);
        throw new Error(`Failed to create appointment: ${appointmentError.message}`);
      }

      console.log('useAppointmentCreation - Appointment created successfully:', appointment.id);

      toast({
        title: 'Success!',
        description: 'Your appointment has been scheduled successfully.',
      });

      navigate('/appointments');
    } catch (error: any) {
      console.error('useAppointmentCreation - Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createAppointment,
    isSubmitting,
  };
};
