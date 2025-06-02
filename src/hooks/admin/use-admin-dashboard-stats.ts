
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface AdminDashboardStats {
  totalUsers: number;
  activeStaff: number;
  todayAppointments: number;
  systemStatus: 'healthy' | 'warning' | 'error';
}

export const useAdminDashboardStats = () => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    activeStaff: 0,
    todayAppointments: 0,
    systemStatus: 'healthy'
  });

  // Fetch total users count
  const { data: usersData } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch active staff count
  const { data: staffData } = useQuery({
    queryKey: ['admin-active-staff-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });

  // Fetch today's appointments count
  const { data: appointmentsData } = useQuery({
    queryKey: ['admin-today-appointments-count'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`);
      
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });

  // Determine system status based on data
  useEffect(() => {
    let systemStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    
    // Check if we have active staff
    if ((staffData || 0) === 0) {
      systemStatus = 'error'; // No active staff is critical
    } else if ((staffData || 0) < 3) {
      systemStatus = 'warning'; // Low staff count
    }

    setStats({
      totalUsers: usersData || 0,
      activeStaff: staffData || 0,
      todayAppointments: appointmentsData || 0,
      systemStatus
    });

    // Debug logging
    console.log('AdminDashboardStats - Updated stats:', {
      totalUsers: usersData || 0,
      activeStaff: staffData || 0,
      todayAppointments: appointmentsData || 0,
      systemStatus
    });
  }, [usersData, staffData, appointmentsData]);

  const refreshStats = () => {
    // This will trigger a refetch of all queries
    window.location.reload();
  };

  return {
    stats,
    refreshStats,
    isLoading: !usersData && !staffData && !appointmentsData
  };
};
