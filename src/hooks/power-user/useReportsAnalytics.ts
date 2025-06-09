
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useReportsAnalytics = () => {
  return useQuery({
    queryKey: ['reports-analytics'],
    queryFn: async () => {
      // Get appointment data for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(name),
          location:locations(name),
          customer:customers(first_name, last_name)
        `)
        .gte('scheduled_time', thirtyDaysAgo.toISOString());

      if (appointmentsError) throw appointmentsError;

      // Get service distribution
      const serviceDistribution = appointments?.reduce((acc, apt) => {
        const serviceName = apt.service?.name || 'Unknown';
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get daily appointment trends
      const dailyTrends = appointments?.reduce((acc, apt) => {
        const date = new Date(apt.scheduled_time).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get status breakdown
      const statusBreakdown = appointments?.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get location performance
      const locationPerformance = appointments?.reduce((acc, apt) => {
        const locationName = apt.location?.name || 'Unknown';
        if (!acc[locationName]) {
          acc[locationName] = { total: 0, completed: 0 };
        }
        acc[locationName].total++;
        if (apt.status === 'completed') {
          acc[locationName].completed++;
        }
        return acc;
      }, {} as Record<string, { total: number; completed: number }>) || {};

      return {
        totalAppointments: appointments?.length || 0,
        serviceDistribution,
        dailyTrends,
        statusBreakdown,
        locationPerformance,
        rawAppointments: appointments || []
      };
    },
    refetchInterval: 60000 // Refresh every minute
  });
};
