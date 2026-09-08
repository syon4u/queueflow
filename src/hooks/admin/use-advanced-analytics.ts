
import { useQuery } from '@tanstack/react-query';
import { getStringProp } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface AdvancedAnalyticsData {
  summary: {
    total_appointments: number;
    completion_rate: number;
    average_wait_time: number;
    average_service_time: number;
    customer_satisfaction: number;
  };
  daily_data: Array<{
    date: string;
    location_name: string;
    location_id: string;
    service_name: string;
    service_id: string;
    total_appointments: number;
    completed: number;
    no_shows: number;
    cancelled: number;
    avg_wait_time: number;
    avg_service_time: number;
    peak_queue_length: number;
    avg_satisfaction: number;
  }>;
  generated_at: string;
}

interface DailyAnalyticsEntry {
  location_id: string;
  service_id: string;
  staff_id: string;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  no_show_appointments: number;
  average_wait_time_minutes: number;
  average_service_time_minutes: number;
  customer_satisfaction_avg: number;
  efficiency_score: number;
}

interface CustomerSatisfactionData {
  id: string;
  rating: number;
  feedback?: string;
  wait_time_rating?: number;
  service_quality_rating?: number;
  overall_experience_rating?: number;
  would_recommend?: boolean;
  created_at: string;
  customer?: { first_name: string; last_name: string };
  location?: { name: string };
  service?: { name: string };
  staff?: { first_name: string; last_name: string };
}

export function useAdvancedAnalytics(
  startDate: string,
  endDate: string,
  locationId?: string,
  serviceId?: string
) {
  return useQuery({
    queryKey: ['advanced-analytics', startDate, endDate, locationId, serviceId],
    queryFn: async (): Promise<AdvancedAnalyticsData> => {
      // Use a direct SQL query since the function isn't in types yet
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          locations!inner(id, name),
          services!inner(id, name)
        `)
        .gte('scheduled_time', startDate)
        .lte('scheduled_time', endDate + ' 23:59:59')
        .eq(locationId ? 'location_id' : 'id', locationId || 'id')
        .eq(serviceId ? 'service_id' : 'id', serviceId || 'id');

      if (error) throw error;

      // Process the data to match expected format
      const processedData = data?.reduce((acc, appointment) => {
        const date = appointment.scheduled_time.split('T')[0];
        const locationName = getStringProp(appointment.locations, 'name') || 'Unknown';
        const serviceName = getStringProp(appointment.services, 'name') || 'Unknown';
        
        const existing = acc.find(item => 
          item.date === date && 
          item.location_id === appointment.location_id && 
          item.service_id === appointment.service_id
        );

        if (existing) {
          existing.total_appointments++;
          if (appointment.status === 'completed') existing.completed++;
          if (appointment.status === 'no_show') existing.no_shows++;
          if (appointment.status === 'cancelled') existing.cancelled++;
        } else {
          acc.push({
            date,
            location_name: locationName,
            location_id: appointment.location_id,
            service_name: serviceName,
            service_id: appointment.service_id,
            total_appointments: 1,
            completed: appointment.status === 'completed' ? 1 : 0,
            no_shows: appointment.status === 'no_show' ? 1 : 0,
            cancelled: appointment.status === 'cancelled' ? 1 : 0,
            avg_wait_time: 15, // Mock data for now
            avg_service_time: 25, // Mock data for now
            peak_queue_length: 5, // Mock data for now
            avg_satisfaction: 4.2 // Mock data for now
          });
        }
        return acc;
      }, [] as AdvancedAnalyticsData['daily_data']) || [];

      const totalAppointments = processedData.reduce((sum, item) => sum + item.total_appointments, 0);
      const totalCompleted = processedData.reduce((sum, item) => sum + item.completed, 0);

      return {
        summary: {
          total_appointments: totalAppointments,
          completion_rate: totalAppointments > 0 ? (totalCompleted / totalAppointments) * 100 : 0,
          average_wait_time: 15.5,
          average_service_time: 25.3,
          customer_satisfaction: 4.2
        },
        daily_data: processedData,
        generated_at: new Date().toISOString()
      };
    },
    refetchInterval: 30000,
    staleTime: 15000
  });
}

export function useDailyAnalytics(targetDate: string) {
  return useQuery({
    queryKey: ['daily-analytics', targetDate],
    queryFn: async (): Promise<DailyAnalyticsEntry[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('scheduled_time', targetDate)
        .lt('scheduled_time', targetDate + ' 23:59:59');

      if (error) throw error;

      // Process data to create daily analytics
      const processed = data?.reduce((acc, appointment) => {
        const key = `${appointment.location_id}-${appointment.service_id}-${appointment.staff_id || 'unassigned'}`;
        
        if (!acc[key]) {
          acc[key] = {
            location_id: appointment.location_id,
            service_id: appointment.service_id,
            staff_id: appointment.staff_id || 'unassigned',
            total_appointments: 0,
            completed_appointments: 0,
            cancelled_appointments: 0,
            no_show_appointments: 0,
            average_wait_time_minutes: 15,
            average_service_time_minutes: 25,
            customer_satisfaction_avg: 4.2,
            efficiency_score: 85
          };
        }

        acc[key].total_appointments++;
        if (appointment.status === 'completed') acc[key].completed_appointments++;
        if (appointment.status === 'cancelled') acc[key].cancelled_appointments++;
        if (appointment.status === 'no_show') acc[key].no_show_appointments++;

        return acc;
      }, {} as Record<string, DailyAnalyticsEntry>) || {};

      return Object.values(processed);
    },
    refetchInterval: 60000,
    staleTime: 30000
  });
}

export function useCustomerSatisfaction(locationId?: string, serviceId?: string) {
  return useQuery({
    queryKey: ['customer-satisfaction', locationId, serviceId],
    queryFn: async (): Promise<CustomerSatisfactionData[]> => {
      // Since customer_satisfaction table isn't in types yet, return mock data
      const mockData: CustomerSatisfactionData[] = [
        {
          id: '1',
          rating: 5,
          feedback: 'Excellent service, very professional staff',
          wait_time_rating: 4,
          service_quality_rating: 5,
          overall_experience_rating: 5,
          would_recommend: true,
          created_at: new Date().toISOString(),
          customer: { first_name: 'John', last_name: 'Doe' },
          location: { name: 'Main Office' },
          service: { name: 'General Consultation' },
          staff: { first_name: 'Jane', last_name: 'Smith' }
        },
        {
          id: '2',
          rating: 4,
          feedback: 'Good service but wait time was a bit long',
          wait_time_rating: 3,
          service_quality_rating: 4,
          overall_experience_rating: 4,
          would_recommend: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          customer: { first_name: 'Alice', last_name: 'Johnson' },
          location: { name: 'Branch Office' },
          service: { name: 'Document Review' },
          staff: { first_name: 'Bob', last_name: 'Wilson' }
        }
      ];

      return mockData;
    },
    refetchInterval: 120000
  });
}

export function useAnalyticsCache(metricType?: string) {
  return useQuery({
    queryKey: ['analytics-cache', metricType],
    queryFn: async () => {
      // Return mock analytics cache data
      return [
        {
          id: '1',
          metric_type: 'daily_summary',
          metric_key: 'appointments_completed',
          metric_value: { count: 45, percentage: 89.2 },
          computed_at: new Date().toISOString()
        }
      ];
    }
  });
}
