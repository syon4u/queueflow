
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueueStatusData {
  appointment_id: string;
  status: string;
  position?: number;
  total_in_queue?: number;
  estimated_wait_time_minutes: number;
  current_wait_time_minutes: number;
  customer_name: string;
  service_name: string;
  check_in_time?: string;
  ticket_number: string;
  location_id: string;
}

interface UseQueueStatusReturn {
  data: QueueStatusData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useQueueStatus = (
  confirmationNumber?: string,
  lastName?: string,
  phone?: string
): UseQueueStatusReturn => {
  const [data, setData] = useState<QueueStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!confirmationNumber && (!lastName || !phone)) {
      setError('Please provide either a confirmation number or both last name and phone number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      let appointmentId: string | null = null;

      if (confirmationNumber) {
        // Look up by confirmation number (using appointment ID)
        const { data: appointments, error: lookupError } = await supabase
          .from('appointments')
          .select('id')
          .ilike('id', `%${confirmationNumber.slice(-8)}%`)
          .limit(1);

        if (lookupError) throw lookupError;
        
        if (appointments && appointments.length > 0) {
          appointmentId = appointments[0].id;
        }
      } else if (lastName && phone) {
        // Look up by customer details
        const cleanPhone = phone.replace(/\D/g, '');
        
        const { data: appointments, error: lookupError } = await supabase
          .from('appointments')
          .select(`
            id,
            customers!appointments_customer_id_fkey(first_name, last_name, phone)
          `)
          .eq('customers.last_name', lastName)
          .order('scheduled_time', { ascending: false })
          .limit(10);

        if (lookupError) throw lookupError;

        if (appointments && appointments.length > 0) {
          // Find matching phone number
          const matchingAppointment = appointments.find(apt => {
            const customerPhone = apt.customers?.phone?.replace(/\D/g, '') || '';
            return customerPhone.includes(cleanPhone) || cleanPhone.includes(customerPhone);
          });

          if (matchingAppointment) {
            appointmentId = matchingAppointment.id;
          }
        }
      }

      if (!appointmentId) {
        setError('No appointment found with the provided information');
        return;
      }

      // Get queue position using the edge function
      const { data: queueData, error: queueError } = await supabase.functions.invoke(
        'queue-position',
        {
          body: { appointment_id: appointmentId }
        }
      );

      if (queueError) throw queueError;

      if (queueData) {
        setData(queueData);
      } else {
        setError('Unable to retrieve queue status');
      }

    } catch (err) {
      console.error('Error fetching queue status:', err);
      setError('Unable to retrieve queue status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};
