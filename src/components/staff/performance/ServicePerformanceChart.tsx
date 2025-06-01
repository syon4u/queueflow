
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import { ServiceMetric } from './types';

interface ServicePerformanceChartProps {
  serviceMetrics: ServiceMetric[] | undefined;
}

const ServicePerformanceChart: React.FC<ServicePerformanceChartProps> = ({ serviceMetrics }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const pieData = React.useMemo(() => {
    if (!serviceMetrics) return [];
    return serviceMetrics.map((service, index) => ({
      name: service.service_name,
      value: service.appointments_count,
      color: COLORS[index % COLORS.length]
    }));
  }, [serviceMetrics]);

  const barData = React.useMemo(() => {
    if (!serviceMetrics) return [];
    return serviceMetrics.map(service => ({
      name: service.service_name.length > 15 
        ? service.service_name.substring(0, 15) + '...' 
        : service.service_name,
      wait_time: service.average_wait_time,
      appointments: service.appointments_count
    }));
  }, [serviceMetrics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Service Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Service Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No service data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Average Wait Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Average Wait Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wait_time" name="Wait Time (min)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No wait time data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicePerformanceChart;
