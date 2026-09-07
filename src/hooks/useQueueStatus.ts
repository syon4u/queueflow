
import { useState } from 'react';
import { customerName, findPublicAppointment, isInQueue, PublicAppointmentStatus } from '@/lib/publicQueue';

interface QueueStatusData {
  appointment_id: string;
  status: PublicAppointmentStatus;
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
  confirmation_code: string;
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
      const appointment = await findPublicAppointment(
        confirmationNumber ? { code: confirmationNumber } : { lastName, phone }
      );

      if (!appointment) {
        setError('No appointment found with the provided information');
        return;
      }

      const currentWaitTime = appointment.check_in_time
        ? Math.floor((Date.now() - new Date(appointment.check_in_time).getTime()) / 60000)
        : 0;

      setData({
        appointment_id: appointment.appointment_id,
        status: appointment.status,
        position: appointment.position ?? undefined,
        total_in_queue: appointment.total_in_queue,
        estimated_wait_time_minutes: appointment.estimated_wait_minutes,
        current_wait_time_minutes: Math.max(0, currentWaitTime),
        customer_name: customerName(appointment),
        service_name: appointment.service_name || 'Unknown Service',
        location_name: appointment.location_name || 'Main Office',
        scheduled_at: appointment.scheduled_time,
        check_in_time: appointment.check_in_time || undefined,
        ticket_number: appointment.ticket_number,
        confirmation_code: appointment.confirmation_code,
        location_id: appointment.location_id || '',
        is_checked_in: isInQueue(appointment.status),
      });

    } catch (err) {
      console.error('Error fetching queue status:', err);
      setError('Unable to retrieve queue status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};
