
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Building2, FileText, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { localDayRangeIso, queueWindowStartIso } from '@/lib/dateRanges';

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

// "Today" / queue-window definitions are shared with /staff and /power-user
// via src/lib/dateRanges.ts.

export const DashboardTab: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch real stats data
  const { data: staffCount = 0 } = useQuery({
    queryKey: ['dashboard-staff-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['staff', 'admin']);
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: locationsCount = 0 } = useQuery({
    queryKey: ['dashboard-locations-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: appointmentsToday = 0 } = useQuery({
    queryKey: ['dashboard-appointments-today'],
    queryFn: async () => {
      // Appointments Today = scheduled_time within the local day, any status.
      const { start, end } = localDayRangeIso();
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_time', start)
        .lt('scheduled_time', end);
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: servicesOffered = 0 } = useQuery({
    queryKey: ['dashboard-services-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    }
  });

  // Live metrics (replaces the previous hardcoded demo numbers)
  // Open Locations = rows in `locations` with queue_status = 'open'. Nothing
  // else (capacity, hours, staff on shift) feeds this number.
  const { data: activeQueues = 0 } = useQuery({
    queryKey: ['dashboard-active-queues'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true })
        .eq('queue_status', 'open');
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: checkedInCustomers = 0 } = useQuery({
    queryKey: ['dashboard-checked-in'],
    queryFn: async () => {
      // Waiting Now = checked_in with check_in_time within the last 24 h — the
      // same window public_queue_snapshot uses, so this matches the kiosk and
      // the staff dashboard. Unscoped, this counted every appointment ever
      // left in 'checked_in' — 12 stale rows showed as "waiting".
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'checked_in')
        .gte('check_in_time', queueWindowStartIso());
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const { data: missedAppointments = 0 } = useQuery({
    queryKey: ['dashboard-missed-today'],
    queryFn: async () => {
      // No-shows Today = status no_show with updated_at within the local day.
      const { start, end } = localDayRangeIso();
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'no_show')
        .gte('updated_at', start)
        .lt('updated_at', end);
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 60000,
  });

  const { data: averageWaitMinutes = null } = useQuery({
    queryKey: ['dashboard-average-wait'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('check_in_time, start_time')
        .not('check_in_time', 'is', null)
        .not('start_time', 'is', null)
        .order('start_time', { ascending: false })
        .limit(50);
      if (error) throw error;
      const waits = (data || [])
        .map((a) => (new Date(a.start_time as string).getTime() - new Date(a.check_in_time as string).getTime()) / 60000)
        .filter((m) => Number.isFinite(m) && m >= 0 && m <= 8 * 60);
      if (waits.length === 0) return null;
      return Math.round(waits.reduce((sum, m) => sum + m, 0) / waits.length);
    },
    refetchInterval: 60000,
  });

  type ActivityRow = {
    id: string;
    status: string;
    updated_at: string;
    location: { name: string } | null;
  };
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['dashboard-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, status, updated_at, location:locations!appointments_location_id_fkey(name)')
        .order('updated_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      const label: Record<string, { action: string; type: string }> = {
        scheduled: { action: 'New appointment scheduled', type: 'appointment' },
        checked_in: { action: 'Customer checked in', type: 'staff' },
        in_progress: { action: 'Service started', type: 'staff' },
        completed: { action: 'Service completed', type: 'completion' },
        cancelled: { action: 'Appointment cancelled', type: 'alert' },
        no_show: { action: 'Customer did not show', type: 'alert' },
      };
      return ((data || []) as unknown as ActivityRow[]).map((row) => ({
        id: row.id,
        action: label[row.status]?.action ?? `Status changed to ${row.status}`,
        type: label[row.status]?.type ?? 'appointment',
        location: row.location?.name ?? 'Unknown location',
        time: formatRelativeTime(row.updated_at),
      }));
    },
    refetchInterval: 30000,
  });

  type LocationRow = { id: string; name: string; queue_status: string; current_capacity: number | null; max_capacity: number | null };
  const { data: locationStatus = [] } = useQuery({
    queryKey: ['dashboard-location-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, queue_status, current_capacity, max_capacity')
        .order('name');
      if (error) throw error;
      return ((data || []) as LocationRow[]).map((loc) => ({
        id: loc.id,
        name: loc.name,
        status: loc.queue_status === 'open' ? 'active' : loc.queue_status || 'closed',
        queue: loc.current_capacity ?? 0,
        capacity: loc.max_capacity ?? null,
      }));
    },
    refetchInterval: 30000,
  });

  const systemMetrics = {
    totalAppointments: appointmentsToday,
    activeQueues,
    checkedInCustomers,
    missedAppointments,
    averageWaitTime: averageWaitMinutes === null ? 'No data yet' : `${averageWaitMinutes} min`,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time overview of your queue management system</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            System Operational
          </Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{systemMetrics.totalAppointments}</div>
            <p className="text-xs text-blue-600 mt-1">Scheduled for today, any status</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Open Locations</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{systemMetrics.activeQueues}</div>
            <p className="text-xs text-green-600 mt-1">Locations with queue_status = &apos;open&apos;</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Waiting Now</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{systemMetrics.checkedInCustomers}</div>
            <p className="text-xs text-purple-600 mt-1">Checked in, last 24 h, not yet called</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">No-shows Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{systemMetrics.missedAppointments}</div>
            <p className="text-xs text-orange-600 mt-1">Marked no-show today</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Real-time Activity
            </CardTitle>
            <CardDescription>Live updates from across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-500">No recent activity yet.</p>
              )}
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'alert' ? 'bg-orange-500' :
                    activity.type === 'appointment' ? 'bg-blue-500' :
                    activity.type === 'staff' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.location} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Location Status
            </CardTitle>
            <CardDescription>Current queue status by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationStatus.length === 0 && (
                <p className="text-sm text-gray-500">No locations configured.</p>
              )}
              {locationStatus.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{location.name}</p>
                    <p className="text-xs text-gray-500">
                      {location.queue} in queue{location.capacity ? ` • capacity ${location.capacity}` : ''}
                    </p>
                  </div>
                  <Badge
                    variant={location.status === 'active' ? 'default' : 'destructive'}
                    className={
                      location.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : location.queue > 0
                          ? 'bg-amber-100 text-amber-800'
                          : ''
                    }
                    title={
                      location.status !== 'active' && location.queue > 0
                        ? `${location.queue} customer(s) still waiting at a closed location`
                        : undefined
                    }
                  >
                    {location.status !== 'active' && location.queue > 0
                      ? `closed · ${location.queue} waiting`
                      : location.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Average Wait Time</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {systemMetrics.averageWaitTime}
                </Badge>
              </div>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Management Actions</CardTitle>
            <CardDescription>Frequently used administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col justify-center gap-2 border-blue-200 hover:bg-blue-50"
                onClick={() => navigate('/admin?tab=queue')}
              >
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Manage Queues</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col justify-center gap-2 border-green-200 hover:bg-green-50"
                onClick={() => navigate('/admin?tab=locations')}
              >
                <Building2 className="h-6 w-6 text-green-600" />
                <span className="text-sm">Locations</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col justify-center gap-2 border-purple-200 hover:bg-purple-50"
                onClick={() => navigate('/admin?tab=users')}
              >
                <Users className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Staff</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col justify-center gap-2 border-orange-200 hover:bg-orange-50"
                onClick={() => navigate('/admin?tab=stats')}
              >
                <TrendingUp className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
