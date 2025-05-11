
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStats {
  total_appointments: number;
  appointments_today: number;
  appointments_by_status: {
    status: string;
    count: number;
  }[];
  appointments_by_service: {
    service_name: string;
    count: number;
  }[];
  appointments_over_time: {
    date: string;
    count: number;
  }[];
  average_wait_time: number;
  average_service_time: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const StatsTab: React.FC = () => {
  const [pollInterval, setPollInterval] = useState<number>(30000); // 30 seconds

  // Fetch admin stats with polling
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-stats');
      
      if (error) throw error;
      return data as AdminStats;
    },
    refetchInterval: pollInterval
  });

  // Effect to handle component unmounting
  useEffect(() => {
    return () => {
      setPollInterval(0); // Stop polling when component unmounts
    };
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading statistics: {(error as Error).message}</div>;
  }

  if (!stats) {
    return <div>No statistics available</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Statistics</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_appointments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.appointments_today}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.average_wait_time} min</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                status1: { color: '#0088FE' },
                status2: { color: '#00C49F' },
                status3: { color: '#FFBB28' },
                status4: { color: '#FF8042' },
                status5: { color: '#8884d8' },
                status6: { color: '#82ca9d' },
              }}
            >
              <PieChart>
                <Pie
                  data={stats.appointments_by_status}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.status}: ${entry.count}`}
                >
                  {stats.appointments_by_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Appointments by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Service</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                count: { color: '#0088FE' }
              }}
            >
              <BarChart
                data={stats.appointments_by_service}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="service_name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Appointments Over Time */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Appointments Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                count: { color: '#8884d8' }
              }}
            >
              <LineChart
                data={stats.appointments_over_time}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-xs text-muted-foreground mt-6">
        Statistics automatically update every 30 seconds
      </div>
    </div>
  );
};
