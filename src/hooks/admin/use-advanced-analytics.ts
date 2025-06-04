
import { useQuery } from '@tanstack/react-query';
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

export function useAdvancedAnalytics(
  startDate: string,
  endDate: string,
  locationId?: string,
  serviceId?: string
) {
  return useQuery({
    queryKey: ['advanced-analytics', startDate, endDate, locationId, serviceId],
    queryFn: async (): Promise<AdvancedAnalyticsData> => {
      const { data, error } = await supabase.rpc('get_advanced_queue_analytics', {
        start_date: startDate,
        end_date: endDate,
        location_filter: locationId || null,
        service_filter: serviceId || null
      });

      if (error) throw error;
      return data as AdvancedAnalyticsData;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000
  });
}

export function useDailyAnalytics(targetDate: string) {
  return useQuery({
    queryKey: ['daily-analytics', targetDate],
    queryFn: async (): Promise<DailyAnalyticsEntry[]> => {
      const { data, error } = await supabase.rpc('calculate_daily_analytics', {
        target_date: targetDate
      });

      if (error) throw error;
      return data as DailyAnalyticsEntry[];
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000
  });
}

export function useCustomerSatisfaction(locationId?: string, serviceId?: string) {
  return useQuery({
    queryKey: ['customer-satisfaction', locationId, serviceId],
    queryFn: async () => {
      let query = supabase
        .from('customer_satisfaction')
        .select(`
          *,
          customer:customers(first_name, last_name),
          appointment:appointments(scheduled_time),
          location:locations(name),
          service:services(name),
          staff:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 120000 // Refresh every 2 minutes
  });
}

export function useAnalyticsCache(metricType?: string) {
  return useQuery({
    queryKey: ['analytics-cache', metricType],
    queryFn: async () => {
      let query = supabase
        .from('analytics_cache')
        .select('*')
        .order('computed_at', { ascending: false });

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}
