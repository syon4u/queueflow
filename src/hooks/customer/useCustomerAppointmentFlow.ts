
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { createPublicAppointment } from '@/lib/publicQueue';
import { getNextBusinessDay } from '@/utils/businessHours';
import { CustomerAppointmentData } from './useSimpleAppointmentForm';

export const useCustomerAppointmentFlow = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Books the appointment and returns its confirmation code, or null on failure (after toasting). */
  const createAppointment = async (customerData: CustomerAppointmentData): Promise<string | null> => {
    setIsSubmitting(true);

    try {
      const scheduledDateTime =
        customerData.preferredDate && customerData.preferredTime
          ? new Date(`${customerData.preferredDate}T${customerData.preferredTime}`)
          : getNextBusinessDay(new Date());

      const appointment = await createPublicAppointment({
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone,
        email: customerData.email,
        serviceId: customerData.serviceId,
        locationId: customerData.locationId,
        scheduledTime: scheduledDateTime.toISOString(),
        reason: customerData.reasonForVisit,
        notes: customerData.additionalNotes,
      });

      return appointment.confirmation_code;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create appointment. Please try again.';
      console.error('Appointment creation failed:', error);
      toast({
        title: 'Booking failed',
        description: message,
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
