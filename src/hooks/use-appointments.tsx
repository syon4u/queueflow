import { supabase } from '@/integrations/supabase/client';
import { useRealtimeAppointments } from './use-realtime-appointments';

export type AppointmentStatus = 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  location_id: string;
  staff_id: string | null;
  status: AppointmentStatus;
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  reason_for_visit: string | null;
  created_at: string;
  updated_at: string;
}

// Mock appointments for demo
const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    customer_id: 'customer-1',
    service_id: 'service-1',
    location_id: 'location-1',
    staff_id: 'staff-1',
    status: 'scheduled',
    scheduled_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    check_in_time: null,
    start_time: null,
    end_time: null,
    notes: 'First time visitor',
    reason_for_visit: 'License renewal',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'appt-2',
    customer_id: 'customer-2',
    service_id: 'service-2',
    location_id: 'location-1',
    staff_id: 'staff-2',
    status: 'checked_in',
    scheduled_time: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    check_in_time: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    start_time: null,
    end_time: null,
    notes: null,
    reason_for_visit: 'ID card application',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 'appt-3',
    customer_id: 'customer-3',
    service_id: 'service-3',
    location_id: 'location-2',
    staff_id: 'staff-1',
    status: 'in_progress',
    scheduled_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    check_in_time: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
    start_time: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    end_time: null,
    notes: 'Needs assistance with forms',
    reason_for_visit: 'Vehicle registration',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 1800000).toISOString()
  }
];

export function useAppointments(serviceId?: string) {
  // In a real app, we would use the useRealtimeAppointments hook
  // But for demo purposes, we'll return mock data
  
  // Mock implementation
  const mockData = {
    appointments: mockAppointments,
    isLoading: false,
    error: null,
    userPosition: 2,
    estimatedWaitTime: 15,
    refreshAppointments: () => console.log('Refreshing appointments')
  };
  
  // Filter by service if provided
  const filteredAppointments = serviceId
    ? mockData.appointments.filter(appointment => appointment.service_id === serviceId)
    : mockData.appointments;

  return { 
    appointments: filteredAppointments, 
    loading: mockData.isLoading, 
    error: mockData.error,
    userPosition: mockData.userPosition,
    estimatedWaitTime: mockData.estimatedWaitTime,
    refreshAppointments: mockData.refreshAppointments
  };
}