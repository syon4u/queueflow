
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePowerUserStats = () => {
  return useQuery({
    queryKey: ['power-user-stats'],
    queryFn: async () => {
      // Get today's date range
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Get total appointments for today
      const { data: todayAppointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, status')
        .gte('scheduled_time', startOfToday.toISOString())
        .lt('scheduled_time', endOfToday.toISOString());

      if (appointmentsError) throw appointmentsError;

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

      // Calculate completion rate for today
      const completedToday = todayAppointments?.filter(apt => apt.status === 'completed').length || 0;
      const totalToday = todayAppointments?.length || 0;
      const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

      return {
        totalAppointments: totalToday,
        activeUsers: users?.length || 0,
        totalLocations: locations?.length || 0,
        totalServices: services?.length || 0,
        completionRate
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });
};
