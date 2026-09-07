
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isAppointmentToday, isServedToday, localDayRangeIso } from '@/lib/dateRanges';

export interface StaffPerformanceMetrics {
  todayStats: {
    customersServed: number;
    averageServiceTime: number;
    completionRate: number;
    onTimePerformance: number;
  };
  weeklyStats: {
    totalCustomersServed: number;
    averageRating: number;
    productivityScore: number;
    busyHours: string[];
  };
  currentWorkload: {
    activeCustomers: number;
    queueLength: number;
    estimatedBacklog: number;
    status: 'available' | 'busy' | 'break' | 'offline';
  };
}

const mapStatusToUnionType = (status: string | null): 'available' | 'busy' | 'break' | 'offline' => {
  switch (status) {
    case 'available':
    case 'active':
      return 'available';
    case 'busy':
      return 'busy';
    case 'break':
      return 'break';
    case 'offline':
    case 'inactive':
      return 'offline';
    default:
      return 'available';
  }
};

export const useStaffPerformance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<StaffPerformanceMetrics>({
    todayStats: {
      customersServed: 0,
      averageServiceTime: 0,
      completionRate: 0,
      onTimePerformance: 0
    },
    weeklyStats: {
      totalCustomersServed: 0,
      averageRating: 0,
      productivityScore: 0,
      busyHours: []
    },
    currentWorkload: {
      activeCustomers: 0,
      queueLength: 0,
      estimatedBacklog: 0,
      status: 'available'
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchPerformanceMetrics = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Today's appointments for this staff member, using the shared local-day
      // definition (src/lib/dateRanges.ts). Rows are matched on either staff
      // column: the queue dashboard assigns via assigned_staff_id, the
      // scheduler via staff_id. Fetch anything scheduled today or finished
      // today, then classify below.
      const now = new Date();
      const { start, end } = localDayRangeIso(now);
      const { data: todayAppointments, error: todayError } = await supabase
        .from('appointments')
        .select('*')
        .or(`staff_id.eq.${user.id},assigned_staff_id.eq.${user.id}`)
        .or(`and(scheduled_time.gte."${start}",scheduled_time.lt."${end}"),and(status.eq.completed,end_time.gte."${start}",end_time.lt."${end}")`);

      if (todayError) throw todayError;

      // Fetch weekly appointments
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weeklyAppointments, error: weeklyError } = await supabase
        .from('appointments')
        .select('*')
        .eq('staff_id', user.id)
        .gte('scheduled_time', weekAgo.toISOString());

      if (weeklyError) throw weeklyError;

      // Served Today = completed with end_time in the local day;
      // total = Appointments Today (scheduled_time in the local day, any status).
      const servedToday = todayAppointments?.filter(a => isServedToday(a, now)) || [];
      const totalToday = todayAppointments?.filter(a => isAppointmentToday(a, now)).length || 0;
      
      const avgServiceTime = servedToday.length > 0 
        ? servedToday.reduce((acc, apt) => {
            if (apt.start_time && apt.end_time) {
              const duration = new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime();
              return acc + (duration / 60000); // Convert to minutes
            }
            return acc;
          }, 0) / servedToday.length
        : 0;

      // Calculate on-time performance (appointments that started within 5 minutes of scheduled time)
      const onTimeAppointments = servedToday.filter(apt => {
        if (!apt.start_time || !apt.scheduled_time) return false;
        const scheduledTime = new Date(apt.scheduled_time).getTime();
        const startTime = new Date(apt.start_time).getTime();
        const diffMinutes = Math.abs(startTime - scheduledTime) / (1000 * 60);
        return diffMinutes <= 5;
      });

      // Calculate weekly stats
      const servedWeekly = weeklyAppointments?.filter(a => a.status === 'completed') || [];
      
      // Calculate busy hours from weekly data
      const hourCounts = new Map();
      servedWeekly.forEach(apt => {
        if (apt.start_time) {
          const hour = new Date(apt.start_time).getHours();
          const hourKey = `${hour.toString().padStart(2, '0')}:00`;
          hourCounts.set(hourKey, (hourCounts.get(hourKey) || 0) + 1);
        }
      });
      
      const busyHours = Array.from(hourCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => hour);

      // Fetch customer satisfaction from surveys
      const { data: surveys, error: surveyError } = await supabase
        .from('customer_surveys')
        .select('rating')
        .in('appointment_id', servedWeekly.map(a => a.id))
        .not('rating', 'is', null);

      const averageRating = surveys && surveys.length > 0
        ? surveys.reduce((sum, survey) => sum + (survey.rating || 0), 0) / surveys.length
        : 0;

      // Get current workload
      const { data: currentQueue, error: queueError } = await supabase
        .from('appointments')
        .select('*')
        .eq('staff_id', user.id)
        .in('status', ['checked_in', 'in_progress']);

      if (queueError) throw queueError;

      // Get staff status from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      setMetrics({
        todayStats: {
          customersServed: servedToday.length,
          averageServiceTime: Math.round(avgServiceTime),
          completionRate: totalToday > 0 ? Math.round((servedToday.length / totalToday) * 100) : 0,
          onTimePerformance: servedToday.length > 0 ? Math.round((onTimeAppointments.length / servedToday.length) * 100) : 0
        },
        weeklyStats: {
          totalCustomersServed: servedWeekly.length,
          averageRating: Math.round(averageRating * 10) / 10,
          productivityScore: Math.min(100, Math.round((servedWeekly.length / 7) * 10)), // Max 10 per day = 100%
          busyHours
        },
        currentWorkload: {
          activeCustomers: currentQueue?.filter(a => a.status === 'in_progress').length || 0,
          queueLength: currentQueue?.filter(a => a.status === 'checked_in').length || 0,
          estimatedBacklog: (currentQueue?.length || 0) * 15, // 15 min per customer
          status: mapStatusToUnionType(profileData?.status)
        }
      });

    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load performance metrics'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceMetrics();
  }, [user]);

  return {
    metrics,
    isLoading,
    refreshMetrics: fetchPerformanceMetrics
  };
};
