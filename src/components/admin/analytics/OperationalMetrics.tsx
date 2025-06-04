
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface OperationalMetricsProps {
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
      peak_queue_length: number;
    }>;
  };
  dailyData?: Array<{
    location_id: string;
    service_id: string;
    staff_id: string;
    total_appointments: number;
    completed_appointments: number;
    efficiency_score: number;
    average_wait_time_minutes: number;
    average_service_time_minutes: number;
  }>;
}

const OperationalMetrics: React.FC<OperationalMetricsProps> = ({ data, dailyData }) => {
  if (!data?.daily_data && !dailyData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No operational data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate operational efficiency metrics
  const totalAppointments = data?.daily_data.reduce((sum, item) => sum + item.total_appointments, 0) || 0;
  const totalCompleted = data?.daily_data.reduce((sum, item) => sum + item.completed, 0) || 0;
  const averageWaitTime = data?.daily_data.length > 0 
    ? data.daily_data.reduce((sum, item) => sum + (item.avg_wait_time || 0), 0) / data.daily_data.length 
    : 0;
  const averageServiceTime = data?.daily_data.length > 0
    ? data.daily_data.reduce((sum, item) => sum + (item.avg_service_time || 0), 0) / data.daily_data.length
    : 0;
  const peakQueueLength = Math.max(...(data?.daily_data.map(item => item.peak_queue_length) || [0]));

  // Calculate efficiency benchmarks
  const completionRate = totalAppointments > 0 ? (totalCompleted / totalAppointments) * 100 : 0;
  const waitTimeTarget = 15; // 15 minutes target
  const serviceTimeTarget = 20; // 20 minutes target
  
  const waitTimeEfficiency = averageWaitTime > 0 ? Math.max(0, 100 - ((averageWaitTime - waitTimeTarget) / waitTimeTarget * 100)) : 100;
  const serviceTimeEfficiency = averageServiceTime > 0 ? Math.max(0, 100 - ((averageServiceTime - serviceTimeTarget) / serviceTimeTarget * 100)) : 100;

  // Location performance breakdown
  const locationPerformance = data?.daily_data.reduce((acc, curr) => {
    const existing = acc.find(item => item.location === curr.location_name);
    
    if (existing) {
      existing.appointments += curr.total_appointments;
      existing.completed += curr.completed;
      existing.avgWaitTime = (existing.avgWaitTime + curr.avg_wait_time) / 2;
    } else {
      acc.push({
        location: curr.location_name,
        appointments: curr.total_appointments,
        completed: curr.completed,
        avgWaitTime: curr.avg_wait_time || 0,
        efficiency: curr.total_appointments > 0 ? (curr.completed / curr.total_appointments) * 100 : 0
      });
    }
    
    return acc;
  }, [] as any[]) || [];

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getWaitTimeStatus = (waitTime: number) => {
    if (waitTime <= 10) return { color: 'green', label: 'Excellent' };
    if (waitTime <= 20) return { color: 'yellow', label: 'Good' };
    if (waitTime <= 30) return { color: 'orange', label: 'Fair' };
    return { color: 'red', label: 'Needs Improvement' };
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-blue-500" />
              <Badge className={getEfficiencyColor(completionRate)}>
                {completionRate.toFixed(1)}%
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900">Completion Rate</h3>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">Target: 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <Badge variant={getWaitTimeStatus(averageWaitTime).color as any}>
                {getWaitTimeStatus(averageWaitTime).label}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900">Avg Wait Time</h3>
            <p className="text-2xl font-bold text-gray-900">{averageWaitTime.toFixed(1)} min</p>
            <p className="text-xs text-gray-500">Target: ≤15 min</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <Badge className={getEfficiencyColor(serviceTimeEfficiency)}>
                {serviceTimeEfficiency.toFixed(0)}%
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900">Service Efficiency</h3>
            <p className="text-2xl font-bold text-gray-900">{averageServiceTime.toFixed(1)} min</p>
            <p className="text-xs text-gray-500">Target: ≤20 min</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-purple-500" />
              {peakQueueLength > 10 ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <Badge variant="outline">Normal</Badge>
              )}
            </div>
            <h3 className="font-semibold text-gray-900">Peak Queue Length</h3>
            <p className="text-2xl font-bold text-gray-900">{peakQueueLength}</p>
            <p className="text-xs text-gray-500">Max concurrent customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Location Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Location Performance Analysis</CardTitle>
          <CardDescription>Efficiency metrics by location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationPerformance.map((location, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{location.location}</h4>
                  <Badge className={getEfficiencyColor(location.efficiency)}>
                    {location.efficiency.toFixed(1)}% Complete
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Appointments</p>
                    <p className="font-semibold">{location.appointments}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Completed</p>
                    <p className="font-semibold">{location.completed}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg Wait Time</p>
                    <p className="font-semibold">{location.avgWaitTime.toFixed(1)} min</p>
                  </div>
                </div>
                
                <Progress value={location.efficiency} className="mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operational Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Insights</CardTitle>
          <CardDescription>Key recommendations for improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {averageWaitTime > 20 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">High Wait Times Detected</p>
                  <p className="text-sm text-yellow-700">
                    Average wait time ({averageWaitTime.toFixed(1)} min) exceeds target. Consider optimizing staff allocation.
                  </p>
                </div>
              </div>
            )}
            
            {completionRate < 85 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Low Completion Rate</p>
                  <p className="text-sm text-red-700">
                    Completion rate ({completionRate.toFixed(1)}%) is below target. Review no-show and cancellation patterns.
                  </p>
                </div>
              </div>
            )}
            
            {peakQueueLength > 15 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800">High Queue Volume</p>
                  <p className="text-sm text-orange-700">
                    Peak queue length ({peakQueueLength}) suggests capacity constraints during busy periods.
                  </p>
                </div>
              </div>
            )}
            
            {completionRate >= 90 && averageWaitTime <= 15 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Excellent Performance</p>
                  <p className="text-sm text-green-700">
                    Operations are performing well with high completion rates and low wait times.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationalMetrics;
