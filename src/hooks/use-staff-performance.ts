
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      // Fetch today's appointments for this staff member
      const today = new Date().toISOString().split('T')[0];
      const { data: todayAppointments, error: todayError } = await supabase
        .from('appointments')
        .select('*')
        .eq('staff_id', user.id)
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`);

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

      // Calculate today's stats
      const servedToday = todayAppointments?.filter(a => a.status === 'completed') || [];
      const totalToday = todayAppointments?.length || 0;
      
      const avgServiceTime = servedToday.length > 0 
        ? servedToday.reduce((acc, apt) => {
            if (apt.start_time && apt.end_time) {
              const duration = new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime();
              return acc + (duration / 60000); // Convert to minutes
            }
            return acc;
          }, 0) / servedToday.length
        : 0;

      // Calculate weekly stats
      const servedWeekly = weeklyAppointments?.filter(a => a.status === 'completed') || [];
      
      // Get current workload
      const { data: currentQueue, error: queueError } = await supabase
        .from('appointments')
        .select('*')
        .eq('staff_id', user.id)
        .in('status', ['checked_in', 'in_progress']);

      if (queueError) throw queueError;

      // Get staff status
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('status')
        .eq('id', user.id)
        .single();

      if (staffError) throw staffError;

      setMetrics({
        todayStats: {
          customersServed: servedToday.length,
          averageServiceTime: Math.round(avgServiceTime),
          completionRate: totalToday > 0 ? Math.round((servedToday.length / totalToday) * 100) : 0,
          onTimePerformance: 95 // Mock data - would need more complex calculation
        },
        weeklyStats: {
          totalCustomersServed: servedWeekly.length,
          averageRating: 4.8, // Mock data - would come from customer feedback
          productivityScore: Math.min(100, servedWeekly.length * 2),
          busyHours: ['10:00', '14:00', '16:00'] // Mock data - would be calculated from appointment patterns
        },
        currentWorkload: {
          activeCustomers: currentQueue?.filter(a => a.status === 'in_progress').length || 0,
          queueLength: currentQueue?.filter(a => a.status === 'checked_in').length || 0,
          estimatedBacklog: (currentQueue?.length || 0) * 15, // 15 min per customer
          status: staffData?.status || 'available'
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
