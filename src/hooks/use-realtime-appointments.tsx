
import { useState, useEffect, useMemo } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { Appointment } from '@/hooks/use-appointments';

interface RealtimeAppointmentsReturn {
  appointments: Appointment[];
  userPosition: number | null;
  estimatedWaitTime: number | null;
  isLoading: boolean;
  error: string | null;
  refreshAppointments: () => void;
}

export const useRealtimeAppointments = (): RealtimeAppointmentsReturn => {
  const { appointments, isLoading, error, refetch } = useAppData();
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);

  // Filter for today's active appointments. Memoised so the effect below only
  // re-runs when the data changes, not on every render.
  const todaysActiveAppointments = useMemo(() => appointments.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    const appointmentDate = new Date(appointment.scheduled_time).toISOString().split('T')[0];
    return appointmentDate === today && ['scheduled', 'checked_in', 'in_progress'].includes(appointment.status);
  }), [appointments]);

  // Calculate queue positions when appointments change
  useEffect(() => {
    const checkedInAppointments = todaysActiveAppointments.filter(apt => apt.status === 'checked_in');
    
    if (checkedInAppointments.length > 0) {
      // For demo purposes, simulate that the first checked-in appointment is "user's"
      const userAppointment = checkedInAppointments[0];
      const position = checkedInAppointments.findIndex(apt => apt.id === userAppointment.id) + 1;
      
      setUserPosition(position);
      
      // Estimate wait time: 15 minutes per person ahead in queue
      const waitTime = Math.max(0, (position - 1) * 15);
      setEstimatedWaitTime(waitTime);
    } else {
      setUserPosition(null);
      setEstimatedWaitTime(null);
    }
  }, [todaysActiveAppointments]);

  const refreshAppointments = () => {
    console.log('useRealtimeAppointments - Manual refresh triggered');
    refetch();
  };

  return {
    appointments: todaysActiveAppointments,
    userPosition,
    estimatedWaitTime,
    isLoading,
    error: error?.message || null,
    refreshAppointments,
  };
};
