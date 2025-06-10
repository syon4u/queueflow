
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      let query = supabase
        .from('appointments')
        .select(`
          id,
          status,
          scheduled_time,
          reason_for_visit,
          notes,
          customers!appointments_customer_id_fkey(
            first_name,
            last_name,
            phone,
            email,
            confirmation_number
          ),
          locations!appointments_location_id_fkey(
            name,
            address
          ),
          services!appointments_service_id_fkey(
            name,
            description
          )
        `);

      if (params.confirmationNumber) {
        // Search by confirmation number
        const customerQuery = await supabase
          .from('customers')
          .select('id')
          .eq('confirmation_number', params.confirmationNumber)
          .single();

        if (customerQuery.error || !customerQuery.data) {
          throw new Error('Appointment not found with this confirmation number');
        }

        query = query.eq('customer_id', customerQuery.data.id);
      } else if (params.lastName && params.phone) {
        // Search by last name and phone
        const customerQuery = await supabase
          .from('customers')
          .select('id')
          .ilike('last_name', `%${params.lastName}%`)
          .eq('phone', params.phone);

        if (customerQuery.error || !customerQuery.data?.length) {
          throw new Error('No appointments found with this name and phone number');
        }

        query = query.in('customer_id', customerQuery.data.map(c => c.id));
      }

      // Get the most recent appointment
      const { data, error } = await query
        .order('scheduled_time', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        throw new Error('Appointment not found');
      }

      // Transform the data structure
      const appointmentData: AppointmentDetails = {
        id: data.id,
        confirmation_number: data.customers?.confirmation_number || '',
        status: data.status,
        scheduled_time: data.scheduled_time,
        reason_for_visit: data.reason_for_visit,
        notes: data.notes,
        customer: data.customers ? {
          first_name: data.customers.first_name,
          last_name: data.customers.last_name,
          phone: data.customers.phone,
          email: data.customers.email,
        } : null,
        location: data.locations ? {
          name: data.locations.name,
          address: data.locations.address,
        } : null,
        service: data.services ? {
          name: data.services.name,
          description: data.services.description,
        } : null,
      };

      setAppointment(appointmentData);
    } catch (err: any) {
      console.error('Error looking up appointment:', err);
      setError(err.message || 'Failed to find appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
    setIsCancelling(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled',
          notes: appointment?.notes ? 
            `${appointment.notes}\n\nCancelled by customer via portal` : 
            'Cancelled by customer via portal'
        })
        .eq('id', appointmentId);

      if (error) {
        throw error;
      }

      // Update local state
      if (appointment) {
        setAppointment({
          ...appointment,
          status: 'cancelled'
        });
      }

      return true;
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment. Please try again.',
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
