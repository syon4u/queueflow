
import { useMemo } from 'react';

export interface Appointment {
  id: string;
  status: string;
  scheduled_time: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  service?: {
    name: string;
    duration: number;
  };
  start_time?: string;
  end_time?: string;
}

export const useAppointmentFilters = (appointments: Appointment[], searchTerm: string, statusFilter: string) => {
  // Filter for today's appointments
  const todaysAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments.filter(apt => 
      new Date(apt.scheduled_time).toDateString() === today
    );
  }, [appointments]);

  // Apply filters
  const filteredAppointments = useMemo(() => {
    return todaysAppointments.filter(apt => {
      const matchesSearch = searchTerm === '' || 
        apt.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [todaysAppointments, searchTerm, statusFilter]);

  // Calculate queue status
  const queueStats = useMemo(() => ({
    waiting: appointments.filter(apt => apt.status === 'checked_in').length,
    inProgress: appointments.filter(apt => apt.status === 'in_progress').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
  }), [appointments]);

  // Calculate performance metrics
  const avgServiceTime = useMemo(() => {
    const completedToday = todaysAppointments.filter(apt => apt.status === 'completed');
    return completedToday.length > 0 
      ? Math.round(completedToday.reduce((acc, apt) => {
          if (apt.start_time && apt.end_time) {
            const duration = new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime();
            return acc + (duration / 60000); // Convert to minutes
          }
          return acc;
        }, 0) / completedToday.length)
      : 0;
  }, [todaysAppointments]);

  return {
    todaysAppointments,
    filteredAppointments,
    queueStats,
    avgServiceTime
  };
};
