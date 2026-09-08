
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import { isNoShowToday, isServedToday, isWithinRange, localDayRange } from '@/lib/dateRanges';

export interface StaffMetric {
  staff_id: string;
  staff_name: string;
  appointments_served: number;
  average_service_time: number;
  no_shows: number;
}

export interface ServiceMetric {
  service_id: string;
  service_name: string;
  appointments_count: number;
  average_wait_time: number;
}

export interface DailyMetric {
  date: string;
  /** Appointments scheduled that day (local day), any status. */
  appointments: number;
  wait_time: number;
  /** Completed that day, by end_time (fallback updated_at). */
  completed: number;
  /** Marked no_show that day, by updated_at. */
  no_shows: number;
}

// Hook for fetching staff performance metrics
export const useStaffMetrics = (timeRange: string, locationId?: string) => {
  return useQuery({
    queryKey: ['staff-metrics', timeRange, locationId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange(timeRange);
      
      // Call the staff-metrics edge function
      const { data, error } = await supabase.functions.invoke('staff-metrics', {
        body: {
          start_date: startDate,
          end_date: endDate,
          location_id: locationId
        }
      });

      if (error) {
        console.error('Error fetching staff metrics:', error);
        throw error;
      }

      return data as StaffMetric[];
    }
  });
};

// Hook for fetching service performance metrics
export const useServiceMetrics = (timeRange: string, locationId?: string) => {
  return useQuery({
    queryKey: ['service-metrics', timeRange, locationId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange(timeRange);
      
      let query = supabase
        .from('appointments')
        .select(`
          service_id,
          services!inner(name),
          status,
          start_time,
          end_time,
          check_in_time
        `)
        .gte('scheduled_time', startDate)
        .lt('scheduled_time', endDate);

      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data: appointments, error } = await query;

      if (error) {
        console.error('Error fetching service metrics:', error);
        throw error;
      }

      // Process appointments to calculate service metrics
      const serviceMap = new Map();
      
      appointments?.forEach((appointment: any) => {
        const serviceId = appointment.service_id;
        const serviceName = appointment.services?.name || 'Unknown Service';
        
        if (!serviceMap.has(serviceId)) {
          serviceMap.set(serviceId, {
            service_id: serviceId,
            service_name: serviceName,
            appointments_count: 0,
            total_wait_time: 0,
            completed_count: 0
          });
        }
        
        const service = serviceMap.get(serviceId);
        service.appointments_count += 1;
        
        // Calculate wait time for completed appointments
        if (appointment.status === 'completed' && appointment.check_in_time && appointment.start_time) {
          const waitTime = new Date(appointment.start_time).getTime() - new Date(appointment.check_in_time).getTime();
          service.total_wait_time += waitTime / (1000 * 60); // Convert to minutes
          service.completed_count += 1;
        }
      });
      
      // Calculate averages
      return Array.from(serviceMap.values()).map(service => ({
        service_id: service.service_id,
        service_name: service.service_name,
        appointments_count: service.appointments_count,
        average_wait_time: service.completed_count > 0 ? service.total_wait_time / service.completed_count : 0
      })) as ServiceMetric[];
    }
  });
};

// Hook for fetching daily appointment metrics
export const useDailyMetrics = (timeRange: string, locationId?: string) => {
  return useQuery({
    queryKey: ['daily-metrics', timeRange, locationId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange(timeRange);
      const range = { start: new Date(startDate), end: new Date(endDate) };

      // Rows scheduled in the range plus rows completed / no-showed in the
      // range, so "Completed" and "No-Shows" follow the shared definitions in
      // src/lib/dateRanges.ts (by end_time / updated_at, not scheduled_time).
      let query = supabase
        .from('appointments')
        .select(`
          scheduled_time,
          status,
          check_in_time,
          start_time,
          end_time,
          updated_at
        `)
        .or([
          `and(scheduled_time.gte."${startDate}",scheduled_time.lt."${endDate}")`,
          `and(status.eq.completed,end_time.gte."${startDate}",end_time.lt."${endDate}")`,
          `and(status.eq.no_show,updated_at.gte."${startDate}",updated_at.lt."${endDate}")`,
        ].join(','));

      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data: appointments, error } = await query;

      if (error) {
        console.error('Error fetching daily metrics:', error);
        throw error;
      }

      // Group appointments by date
      const dailyMap = new Map();
      
      const bucket = (iso: string) => {
        const date = format(new Date(iso), 'yyyy-MM-dd');
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            appointments: 0,
            total_wait_time: 0,
            completed_count: 0,
            completed: 0,
            no_shows: 0
          });
        }
        return dailyMap.get(date);
      };

      appointments?.forEach((appointment: any) => {
        // Appointments = scheduled that day, any status.
        if (isWithinRange(appointment.scheduled_time, range)) {
          const daily = bucket(appointment.scheduled_time);
          daily.appointments += 1;

          // Calculate wait time for completed appointments
          if (appointment.status === 'completed' && appointment.check_in_time && appointment.start_time) {
            const waitTime = new Date(appointment.start_time).getTime() - new Date(appointment.check_in_time).getTime();
            daily.total_wait_time += waitTime / (1000 * 60); // Convert to minutes
            daily.completed_count += 1;
          }
        }

        // Completed = end_time (fallback updated_at) that day; No-shows = updated_at that day.
        const finishedAt = appointment.end_time ?? appointment.updated_at;
        if (appointment.status === 'completed' && isWithinRange(finishedAt, range)) {
          bucket(finishedAt).completed += 1;
        } else if (appointment.status === 'no_show' && isWithinRange(appointment.updated_at, range)) {
          bucket(appointment.updated_at).no_shows += 1;
        }
      });
      
      // Calculate averages and format for display
      return Array.from(dailyMap.values())
        .map(daily => ({
          date: format(new Date(daily.date), 'MMM dd'),
          appointments: daily.appointments,
          wait_time: daily.completed_count > 0 ? daily.total_wait_time / daily.completed_count : 0,
          completed: daily.completed,
          no_shows: daily.no_shows
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as DailyMetric[];
    }
  });
};

// Helper function to get date range based on timeRange.
// Returns ISO strings with an explicit zone for `.gte(start)` / `.lt(end)`.
// "today" / "yesterday" are the browser's local calendar day (src/lib/dateRanges.ts);
// the previous zone-less 'yyyy-MM-ddT00:00:00' strings were read as UTC by Postgres.
function getDateRange(timeRange: string) {
  const today = new Date();
  let startDate: string;
  let endDate: string = today.toISOString();

  switch (timeRange) {
    case 'today': {
      const { start, end } = localDayRange(today);
      startDate = start.toISOString();
      endDate = end.toISOString();
      break;
    }
    case 'yesterday': {
      const { start, end } = localDayRange(subDays(today, 1));
      startDate = start.toISOString();
      endDate = end.toISOString();
      break;
    }
    case 'week':
      startDate = subDays(today, 7).toISOString();
      break;
    case 'month':
      startDate = subDays(today, 30).toISOString();
      break;
    case 'quarter':
      startDate = subDays(today, 90).toISOString();
      break;
    default:
      // Try to parse as number of days
    {
      const days = parseInt(timeRange) || 7;
      startDate = subDays(today, days).toISOString();
    }
  }

  return { startDate, endDate };
}
