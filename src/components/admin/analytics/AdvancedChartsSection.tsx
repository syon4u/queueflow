
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';

interface AdvancedChartsSectionProps {
  data?: {
    daily_data: Array<{
      date: string;
      location_name: string;
      service_name: string;
      total_appointments: number;
      completed: number;
      no_shows: number;
      cancelled: number;
      avg_wait_time: number;
      avg_service_time: number;
      avg_satisfaction: number;
    }>;
  };
}

const AdvancedChartsSection: React.FC<AdvancedChartsSectionProps> = ({ data }) => {
  if (!data?.daily_data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 h-80">
              <div className="animate-pulse h-full bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Process data for charts
  const dailyTrends = data.daily_data
    .reduce((acc, curr) => {
      const date = curr.date;
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        existing.appointments += curr.total_appointments;
        existing.completed += curr.completed;
        existing.wait_time = (existing.wait_time + curr.avg_wait_time) / 2;
      } else {
        acc.push({
          date,
          appointments: curr.total_appointments,
          completed: curr.completed,
          wait_time: curr.avg_wait_time || 0,
          satisfaction: curr.avg_satisfaction || 0
        });
      }
      
      return acc;
    }, [] as any[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Last 14 days

  // Status distribution
  const statusData = data.daily_data.reduce((acc, curr) => {
    acc.completed += curr.completed;
    acc.no_shows += curr.no_shows;
    acc.cancelled += curr.cancelled;
    return acc;
  }, { completed: 0, no_shows: 0, cancelled: 0 });

  const pieData = [
    { name: 'Completed', value: statusData.completed, color: '#10b981' },
    { name: 'No Shows', value: statusData.no_shows, color: '#f59e0b' },
    { name: 'Cancelled', value: statusData.cancelled, color: '#ef4444' }
  ];

  // Service performance
  const servicePerformance = data.daily_data
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.service === curr.service_name);
      
      if (existing) {
        existing.appointments += curr.total_appointments;
        existing.avg_wait_time = (existing.avg_wait_time + curr.avg_wait_time) / 2;
        existing.completion_rate = ((existing.completion_rate + (curr.completed / curr.total_appointments * 100)) / 2);
      } else {
        acc.push({
          service: curr.service_name,
          appointments: curr.total_appointments,
          avg_wait_time: curr.avg_wait_time || 0,
          completion_rate: curr.total_appointments > 0 ? (curr.completed / curr.total_appointments * 100) : 0
        });
      }
      
      return acc;
    }, [] as any[])
    .sort((a, b) => b.appointments - a.appointments)
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Appointments Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Appointments Trend</CardTitle>
          <CardDescription>Total and completed appointments over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(parseISO(value), 'MM/dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => format(parseISO(value as string), 'MMM dd, yyyy')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Appointments"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Wait Time Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Average Wait Time Trend</CardTitle>
          <CardDescription>Daily wait time performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(parseISO(value), 'MM/dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => format(parseISO(value as string), 'MMM dd, yyyy')}
                formatter={(value) => [`${Number(value).toFixed(1)} min`, 'Wait Time']}
              />
              <Line 
                type="monotone" 
                dataKey="wait_time" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Avg Wait Time (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appointment Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Status Distribution</CardTitle>
          <CardDescription>Breakdown of appointment outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
          <CardDescription>Wait time and completion rate by service</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={servicePerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="service" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="avg_wait_time" 
                fill="#f59e0b" 
                name="Avg Wait Time (min)"
              />
              <Bar 
                dataKey="completion_rate" 
                fill="#10b981" 
                name="Completion Rate (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedChartsSection;
