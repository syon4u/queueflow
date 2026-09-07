
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cancelPublicAppointment, listPublicAppointments, PublicAppointment } from '@/lib/publicQueue';

interface LookupParams {
  confirmationNumber?: string;
  lastName?: string;
  phone?: string;
}

interface AppointmentDetails {
  id: string;
  confirmation_number: string;
  status: string;
  scheduled_time: string;
  reason_for_visit: string | null;
  notes: string | null;
  customer: {
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string | null;
  } | null;
  location: {
    name: string;
    address: string | null;
  } | null;
  service: {
    name: string;
    description: string | null;
  } | null;
}

const toDetails = (a: PublicAppointment): AppointmentDetails => ({
  id: a.appointment_id,
  // Prefer the customer code (what older confirmations showed), else the appointment code.
  confirmation_number: a.customer_confirmation || a.confirmation_code,
  status: a.status,
  scheduled_time: a.scheduled_time,
  reason_for_visit: a.reason_for_visit,
  notes: a.notes,
  customer: {
    first_name: a.first_name,
    last_name: a.last_name,
    phone: a.phone,
    email: a.email,
  },
  location: a.location_name ? { name: a.location_name, address: a.location_address } : null,
  service: a.service_name ? { name: a.service_name, description: a.service_description } : null,
});

export const useAppointmentLookup = () => {
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const lookupAppointment = async (params: LookupParams) => {
    setIsLoading(true);
    setError(null);
    setAppointment(null);

    try {
      const matches = await listPublicAppointments(
        params.confirmationNumber
          ? { code: params.confirmationNumber }
          : { lastName: params.lastName, phone: params.phone }
      );

      if (matches.length === 0) {
        throw new Error(
          params.confirmationNumber
            ? 'Appointment not found with this confirmation number'
            : 'No appointments found with this name and phone number'
        );
      }

      // Active (in queue / upcoming) first, then most recent — same order the server returns.
      setAppointment(toDetails(matches[0]));
    } catch (err) {
      console.error('Error looking up appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to find appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
    setIsCancelling(true);

    try {
      const cancelled = await cancelPublicAppointment(appointmentId, appointment?.confirmation_number);
      setAppointment(toDetails(cancelled));
      return true;
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to cancel appointment. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    appointment,
    isLoading,
    isCancelling,
    error,
    lookupAppointment,
    cancelAppointment,
  };
};
