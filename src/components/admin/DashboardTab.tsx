
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const DashboardTab: React.FC = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-stats');
      
      if (error) throw error;
      return data;
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Mock data for service distribution
  const serviceData = [
    { name: 'Check-up', value: 20 },
    { name: 'Consultation', value: 15 },
    { name: 'Procedure', value: 10 },
    { name: 'Follow-up', value: 25 }
  ];

  // Function to get count for a specific status
  const getCountByStatus = (status: string) => {
    if (!stats?.today_totals) return 0;
    return stats.today_totals[status] || 0;
  };

  // Get total appointments for today
  const getTotalAppointments = () => {
    if (!stats?.today_totals) return 0;
    return Object.values(stats.today_totals).reduce((sum: any, count: any) => sum + count, 0);
  };

  // Get average wait time from stats
  const getAverageWaitTime = () => {
    if (!stats?.service_wait_times || stats.service_wait_times.length === 0) return 0;
    
    const sum = stats.service_wait_times.reduce((total: number, service: any) => {
      return total + service.avg_wait_minutes;
    }, 0);
    
    return Math.round(sum / stats.service_wait_times.length);
  };

  // Get current queue count
  const getCurrentQueueCount = () => {
    if (!stats?.location_queues) return 0;
    
    return stats.location_queues.reduce((total: number, location: any) => {
      if (!location.queue) return total;
      return total + location.queue.filter((appointment: any) => 
        appointment.status === 'checked_in' || appointment.status === 'scheduled'
      ).length;
    }, 0);
  };

  // Get active locations count
  const getActiveLocationsCount = () => {
    if (!stats?.location_queues) return 0;
    return stats.location_queues.filter((location: any) => 
      location.queue && location.queue.length > 0
    ).length;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Administration</h1>
      <p className="text-muted-foreground mb-6">Manage system settings, users, and view analytics</p>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <CardDescription>Today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getTotalAppointments()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
            <CardDescription>Today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getAverageWaitTime()} min</div>
            <p className="text-xs text-green-500">Within target time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Queue</CardTitle>
            <CardDescription>All Locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getCurrentQueueCount()}</div>
            <p className="text-xs text-muted-foreground">{getActiveLocationsCount()} locations active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff Online</CardTitle>
            <CardDescription>Current</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 on break</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Location Overview and Service Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Overview</CardTitle>
            <CardDescription>Current status across all service locations</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && stats.location_queues && stats.location_queues.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Queue</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.location_queues.map((location: any) => (
                    <TableRow key={location.location_id}>
                      <TableCell>{location.location_name}</TableCell>
                      <TableCell>{location.queue ? location.queue.length : 0}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        {location.queue && location.queue.length > 0 
                          ? Math.round(location.queue.reduce((sum: number, appt: any) => 
                              sum + (appt.wait_duration_minutes || 0), 0) / location.queue.length) + ' min'
                          : '0 min'
                        }
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          location.queue && location.queue.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.queue && location.queue.length > 0 ? 'Active' : 'Idle'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center h-40 text-muted-foreground">
                No location data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Service Type Distribution</CardTitle>
            <CardDescription>Today's appointments by service type</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && stats.service_wait_times && stats.service_wait_times.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.service_wait_times.map((service: any, index: number) => ({
                        name: service.service_name,
                        value: service.avg_wait_minutes
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name}) => name}
                    >
                      {stats.service_wait_times.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40 text-muted-foreground">
                No service data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
