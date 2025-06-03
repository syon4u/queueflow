
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Building2, FileText, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`);
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

  // Mock data for demonstration
  const systemMetrics = {
    totalAppointments: appointmentsToday,
    activeQueues: 8,
    checkedInCustomers: 23,
    missedAppointments: 2,
    averageWaitTime: '12 min',
    systemUptime: '99.8%'
  };

  const recentActivity = [
    { id: 1, action: 'New appointment scheduled', location: 'Downtown Branch', time: '2 minutes ago', type: 'appointment' },
    { id: 2, action: 'Queue threshold reached', location: 'North Center', time: '5 minutes ago', type: 'alert' },
    { id: 3, action: 'Staff member checked in', location: 'West Office', time: '8 minutes ago', type: 'staff' },
    { id: 4, action: 'Service completed', location: 'Downtown Branch', time: '12 minutes ago', type: 'completion' }
  ];

  const locationStatus = [
    { name: 'Downtown Branch', status: 'active', queue: 8, waitTime: '15 min' },
    { name: 'North Center', status: 'active', queue: 12, waitTime: '22 min' },
    { name: 'West Office', status: 'active', queue: 5, waitTime: '8 min' },
    { name: 'South Branch', status: 'maintenance', queue: 0, waitTime: 'N/A' }
  ];

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
            <CardTitle className="text-sm font-medium text-blue-800">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{systemMetrics.totalAppointments}</div>
            <p className="text-xs text-blue-600 mt-1">Today's scheduled appointments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Queues</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{systemMetrics.activeQueues}</div>
            <p className="text-xs text-green-600 mt-1">Across all locations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Checked-in Customers</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{systemMetrics.checkedInCustomers}</div>
            <p className="text-xs text-purple-600 mt-1">Currently waiting in queues</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Missed Appointments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{systemMetrics.missedAppointments}</div>
            <p className="text-xs text-orange-600 mt-1">Requires follow-up</p>
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
              {locationStatus.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{location.name}</p>
                    <p className="text-xs text-gray-500">
                      {location.queue} in queue • {location.waitTime} wait
                    </p>
                  </div>
                  <Badge 
                    variant={location.status === 'active' ? 'default' : 'destructive'}
                    className={location.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {location.status}
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
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">System Uptime</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {systemMetrics.systemUptime}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Active Staff</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {staffCount} online
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
