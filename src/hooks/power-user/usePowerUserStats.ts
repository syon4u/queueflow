
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { localDayRangeIso } from '@/lib/dateRanges';

export const usePowerUserStats = () => {
  return useQuery({
    queryKey: ['power-user-stats'],
    queryFn: async () => {
      // Shared "today" definition (src/lib/dateRanges.ts): local calendar day.
      const { start, end } = localDayRangeIso();

      // Appointments Today = scheduled_time within the local day, any status.
      const { count: totalToday, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_time', start)
        .lt('scheduled_time', end);

      if (appointmentsError) throw appointmentsError;

      // Served Today = status completed with end_time within the local day.
      const { count: completedToday, error: completedError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('end_time', start)
        .lt('end_time', end);

      if (completedError) throw completedError;

      // Get total active users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('status', 'active');

      if (usersError) throw usersError;

      // Get total locations
      const { data: locations, error: locationsError } = await supabase
        .from('locations')
        .select('id');

      if (locationsError) throw locationsError;

      // Get total services
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .eq('is_active', true);

      if (servicesError) throw servicesError;

      // Completion rate = Served Today / Appointments Today
      const completionRate = (totalToday ?? 0) > 0 ? Math.round(((completedToday ?? 0) / (totalToday ?? 0)) * 100) : 0;

      return {
        totalAppointments: totalToday ?? 0,
        completedToday: completedToday ?? 0,
        activeUsers: users?.length || 0,
        totalLocations: locations?.length || 0,
        totalServices: services?.length || 0,
        completionRate
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });
};
