
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueueStatusData {
  appointment_id: string;
  status: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  position?: number;
  total_in_queue?: number;
  estimated_wait_time_minutes: number;
  current_wait_time_minutes: number;
  customer_name: string;
  service_name: string;
  location_name: string;
  scheduled_at: string;
  check_in_time?: string;
  ticket_number: string;
  location_id: string;
  is_checked_in: boolean;
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
        // First try to find by customer confirmation number (CUST-XXXXXXXX)
        if (confirmationNumber.startsWith('CUST-')) {
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select(`
              id,
              appointments!appointments_customer_id_fkey(
                id,
                status,
                scheduled_time,
                check_in_time,
                services!appointments_service_id_fkey(name),
                locations!appointments_location_id_fkey(name)
              )
            `)
            .eq('confirmation_number', confirmationNumber.toUpperCase())
            .maybeSingle();

          if (customerError) throw customerError;

          if (customerData && customerData.appointments && customerData.appointments.length > 0) {
            // Get the most recent appointment
            const mostRecentAppointment = customerData.appointments
              .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime())[0];
            appointmentId = mostRecentAppointment.id;
          }
        } else if (confirmationNumber.startsWith('APT-')) {
          // Handle appointment confirmation format (APT-XXXXXXXX)
          const appointmentIdPrefix = confirmationNumber.substring(4).toLowerCase();
          
          const { data: appointments, error: lookupError } = await supabase
            .from('appointments')
            .select(`
              id,
              status,
              scheduled_time,
              check_in_time,
              customers!appointments_customer_id_fkey(first_name, last_name),
              services!appointments_service_id_fkey(name),
              locations!appointments_location_id_fkey(name)
            `)
            .gte('scheduled_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Within last 7 days
            .order('scheduled_time', { ascending: false });

          if (lookupError) throw lookupError;

          // Filter appointments client-side to find matching ID prefix
          const matchingAppointment = appointments?.find(apt => 
            apt.id.toLowerCase().startsWith(appointmentIdPrefix)
          );

          if (matchingAppointment) {
            appointmentId = matchingAppointment.id;
          }
        }
      } else if (lastName && phone) {
        // Look up by customer details
        const cleanPhone = phone.replace(/\D/g, '');
        
        const { data: customers, error: lookupError } = await supabase
          .from('customers')
          .select(`
            id,
            phone,
            appointments!appointments_customer_id_fkey(
              id,
              scheduled_time,
              status
            )
          `)
          .ilike('last_name', lastName)
          .order('created_at', { ascending: false })
          .limit(10);

        if (lookupError) throw lookupError;

        if (customers && customers.length > 0) {
          // Find matching phone number
          const matchingCustomer = customers.find(customer => {
            const customerPhone = customer.phone?.replace(/\D/g, '') || '';
            return customerPhone.includes(cleanPhone) || cleanPhone.includes(customerPhone);
          });

          if (matchingCustomer && matchingCustomer.appointments && matchingCustomer.appointments.length > 0) {
            // Get the most recent appointment
            const mostRecentAppointment = matchingCustomer.appointments
              .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime())[0];
            appointmentId = mostRecentAppointment.id;
          }
        }
      }

      if (!appointmentId) {
        setError('No appointment found with the provided information');
        return;
      }

      console.log('Found appointment ID:', appointmentId);

      // Get queue position using the edge function with appointment ID in the body
      const { data: queueData, error: queueError } = await supabase.functions.invoke(
        'queue-position',
        {
          body: { appointment_id: appointmentId }
        }
      );

      if (queueError) {
        console.error('Edge function error:', queueError);
        throw queueError;
      }

      if (queueData) {
        console.log('Queue data received:', queueData);
        
        // Transform the data to include check-in status and location name
        const transformedData: QueueStatusData = {
          ...queueData,
          is_checked_in: queueData.status === 'checked_in' || queueData.status === 'in_progress',
          location_name: 'Main Office', // Default location name since it's not in the response
          scheduled_at: queueData.scheduled_time || new Date().toISOString()
        };
        
        setData(transformedData);
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
