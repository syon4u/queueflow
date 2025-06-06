
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
      let appointment = null;

      if (confirmationNumber) {
        const code = confirmationNumber.toUpperCase();
        
        if (code.startsWith('CUST-')) {
          // Look up by customer confirmation number
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
                locations!appointments_location_id_fkey(name),
                customers!appointments_customer_id_fkey(first_name, last_name)
              )
            `)
            .eq('confirmation_number', code)
            .maybeSingle();

          if (customerError) throw customerError;

          if (customerData && customerData.appointments && customerData.appointments.length > 0) {
            // Get the most recent appointment
            appointment = customerData.appointments
              .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime())[0];
          }
        } else if (code.startsWith('APT-')) {
          // Look up by appointment ID prefix
          const appointmentIdPrefix = code.substring(4).toLowerCase();
          
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
            .gte('scheduled_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('scheduled_time', { ascending: false });

          if (lookupError) throw lookupError;

          appointment = appointments?.find(apt => 
            apt.id.toLowerCase().startsWith(appointmentIdPrefix)
          );
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
              status,
              check_in_time,
              services!appointments_service_id_fkey(name),
              locations!appointments_location_id_fkey(name),
              customers!appointments_customer_id_fkey(first_name, last_name)
            )
          `)
          .ilike('last_name', lastName)
          .order('created_at', { ascending: false })
          .limit(10);

        if (lookupError) throw lookupError;

        if (customers && customers.length > 0) {
          const matchingCustomer = customers.find(customer => {
            const customerPhone = customer.phone?.replace(/\D/g, '') || '';
            return customerPhone.includes(cleanPhone) || cleanPhone.includes(customerPhone);
          });

          if (matchingCustomer && matchingCustomer.appointments && matchingCustomer.appointments.length > 0) {
            appointment = matchingCustomer.appointments
              .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime())[0];
          }
        }
      }

      if (!appointment) {
        setError('No appointment found with the provided information');
        return;
      }

      console.log('Found appointment:', appointment);

      // Get queue position if checked in
      let position = null;
      let estimatedWaitTime = 0;
      let currentWaitTime = 0;

      if (appointment.status === 'checked_in' && appointment.check_in_time) {
        // Get queue position
        const { data: queueData, error: queueError } = await supabase
          .from('appointments')
          .select('id, check_in_time')
          .eq('location_id', appointment.locations?.id || '')
          .eq('status', 'checked_in')
          .order('check_in_time', { ascending: true });

        if (!queueError && queueData) {
          const queuePosition = queueData.findIndex(item => item.id === appointment.id) + 1;
          if (queuePosition > 0) {
            position = queuePosition;
            estimatedWaitTime = Math.max(0, (position - 1) * 15); // 15 min average
          }
        }

        // Calculate current wait time
        const checkInTime = new Date(appointment.check_in_time);
        currentWaitTime = Math.floor((Date.now() - checkInTime.getTime()) / 60000);
      }

      const transformedData: QueueStatusData = {
        appointment_id: appointment.id,
        status: appointment.status,
        position,
        estimated_wait_time_minutes: estimatedWaitTime,
        current_wait_time_minutes: Math.max(0, currentWaitTime),
        customer_name: `${appointment.customers?.first_name || ''} ${appointment.customers?.last_name || ''}`.trim(),
        service_name: appointment.services?.name || 'Unknown Service',
        location_name: appointment.locations?.name || 'Main Office',
        scheduled_at: appointment.scheduled_time,
        check_in_time: appointment.check_in_time || undefined,
        ticket_number: appointment.id.slice(-8).toUpperCase(),
        location_id: appointment.locations?.id || '',
        is_checked_in: appointment.status === 'checked_in' || appointment.status === 'in_progress'
      };

      setData(transformedData);

    } catch (err) {
      console.error('Error fetching queue status:', err);
      setError('Unable to retrieve queue status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};
