
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, CheckCircle, XCircle, ArrowDownToLine } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, subWeeks, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Time period options for the report
const TIME_PERIODS = [
  { value: 'today', label: 'Today', days: 0 },
  { value: 'yesterday', label: 'Yesterday', days: 1 },
  { value: 'week', label: 'This Week', days: 7 },
  { value: 'month', label: 'This Month', days: 30 },
  { value: 'quarter', label: 'This Quarter', days: 90 }
];

// Types for metrics data
interface StaffMetric {
  staff_id: string;
  staff_name: string;
  appointments_served: number;
  average_service_time: number;
  no_shows: number;
}

interface ServiceMetric {
  service_id: string;
  service_name: string;
  appointments_count: number;
  average_wait_time: number;
}

interface DailyMetric {
  date: string;
  appointments: number;
  wait_time: number;
}

const StaffPerformanceReport: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('week');
  const [staffActiveTab, setStaffActiveTab] = useState('metrics');
  
  // Get date range based on selected time period
  const getDateRange = () => {
    const today = new Date();
    const selectedPeriod = TIME_PERIODS.find(period => period.value === timeRange);
    const days = selectedPeriod?.days || 7;
    
    let startDate;
    if (timeRange === 'today') {
      startDate = startOfDay(today);
    } else if (timeRange === 'yesterday') {
      startDate = startOfDay(subDays(today, 1));
      today.setDate(today.getDate() - 1);
    } else {
      startDate = startOfDay(subDays(today, days));
    }
    
    return {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endOfDay(today), 'yyyy-MM-dd')
    };
  };

  // Fetch staff performance metrics
  const { data: staffMetrics, isLoading: staffLoading } = useQuery({
    queryKey: ['staff-metrics', timeRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      try {
        const { data, error } = await supabase.rpc('get_staff_metrics', {
          start_date: start,
          end_date: end
        });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching staff metrics:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load staff metrics. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  // Fetch service metrics
  const { data: serviceMetrics, isLoading: serviceLoading } = useQuery({
    queryKey: ['service-metrics', timeRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      try {
        const { data, error } = await supabase.rpc('get_service_metrics', {
          start_date: start,
          end_date: end
        });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching service metrics:', error);
        return [];
      }
    }
  });

  // Fetch daily metrics for charts
  const { data: dailyMetrics, isLoading: dailyLoading } = useQuery({
    queryKey: ['daily-metrics', timeRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      try {
        const { data, error } = await supabase.rpc('get_daily_metrics', {
          start_date: start,
          end_date: end
        });
        
        if (error) throw error;
        
        // Format dates for chart display
        return (data || []).map((item: any) => ({
          ...item,
          date: format(new Date(item.date), 'MMM dd')
        }));
      } catch (error) {
        console.error('Error fetching daily metrics:', error);
        return [];
      }
    }
  });

  // Download report as CSV
  const downloadReportCSV = () => {
    // Combine all metrics data
    const combinedData = {
      staff: staffMetrics || [],
      services: serviceMetrics || [],
      daily: dailyMetrics || []
    };

    // Convert to CSV format
    const jsonString = JSON.stringify(combinedData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: 'Report Downloaded',
      description: 'Your performance report has been downloaded successfully.'
    });
  };

  // Loading states for queries
  const isLoading = staffLoading || serviceLoading || dailyLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Performance Reports</h2>
        
        <div className="flex items-center gap-3">
          {/* Time period selector */}
          <div className="flex bg-muted rounded-lg p-1 text-sm">
            {TIME_PERIODS.map((period) => (
              <button
                key={period.value}
                className={`px-3 py-1 rounded-md transition-colors ${
                  timeRange === period.value
                    ? 'bg-white text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setTimeRange(period.value)}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          {/* Export button */}
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={downloadReportCSV}
            disabled={isLoading}
          >
            <ArrowDownToLine size={16} />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Daily statistics chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Daily Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dailyMetrics}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="appointments" name="Appointments" fill="#6366f1" />
                  <Bar yAxisId="right" dataKey="wait_time" name="Avg. Wait (min)" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Staff performance metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Staff Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" onValueChange={setStaffActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="chart">Service Time</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium">Staff Member</th>
                          <th className="text-center py-2 px-4 font-medium">Appointments</th>
                          <th className="text-center py-2 px-4 font-medium">Avg. Service (min)</th>
                          <th className="text-center py-2 px-4 font-medium">No-shows</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffMetrics && staffMetrics.length > 0 ? (
                          staffMetrics.map((staff: StaffMetric) => (
                            <tr key={staff.staff_id} className="border-b">
                              <td className="py-3 px-4">{staff.staff_name || 'Unknown'}</td>
                              <td className="text-center py-3 px-4">{staff.appointments_served}</td>
                              <td className="text-center py-3 px-4">{staff.average_service_time.toFixed(1)}</td>
                              <td className="text-center py-3 px-4">{staff.no_shows}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center py-6 text-muted-foreground">
                              No staff data available for this period
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="chart">
                  {staffMetrics && staffMetrics.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={staffMetrics}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="staff_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average_service_time" name="Avg. Service Time (min)" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No staff data available for this period
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Service metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Service Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Service</th>
                      <th className="text-center py-2 px-4 font-medium">Appointments</th>
                      <th className="text-center py-2 px-4 font-medium">Avg. Wait Time (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceMetrics && serviceMetrics.length > 0 ? (
                      serviceMetrics.map((service: ServiceMetric) => (
                        <tr key={service.service_id} className="border-b">
                          <td className="py-3 px-4">{service.service_name || 'Unknown'}</td>
                          <td className="text-center py-3 px-4">{service.appointments_count}</td>
                          <td className="text-center py-3 px-4">{service.average_wait_time.toFixed(1)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-muted-foreground">
                          No service data available for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Summary metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">Total Appointments</span>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">
                  {dailyMetrics ? 
                    dailyMetrics.reduce((sum: number, day: any) => sum + day.appointments, 0) 
                    : 0
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">Average Wait Time</span>
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-3xl font-bold">
                  {serviceMetrics && serviceMetrics.length > 0
                    ? (serviceMetrics.reduce((sum: number, service: any) => 
                        sum + service.average_wait_time, 0) / serviceMetrics.length).toFixed(1)
                    : "0"} <span className="text-lg font-normal">min</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">Completed</span>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold">
                  {staffMetrics ? 
                    staffMetrics.reduce((sum: number, staff: any) => sum + staff.appointments_served, 0) 
                    : 0
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">No-Shows</span>
                  <XCircle className="h-5 w-5 text-rose-500" />
                </div>
                <div className="text-3xl font-bold">
                  {staffMetrics ? 
                    staffMetrics.reduce((sum: number, staff: any) => sum + staff.no_shows, 0) 
                    : 0
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPerformanceReport;
