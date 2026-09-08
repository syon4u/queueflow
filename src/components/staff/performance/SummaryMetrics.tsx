
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SummaryMetricsProps } from './types';

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ dailyMetrics, serviceMetrics }) => {
  // Calculate total appointments
  const totalAppointments = Array.isArray(dailyMetrics) ? 
    dailyMetrics.reduce((sum, day) => sum + day.appointments, 0) : 0;
  
  // Calculate average wait time
  const averageWaitTime = Array.isArray(serviceMetrics) && serviceMetrics.length > 0 ?
    (serviceMetrics.reduce((sum, service) => sum + service.average_wait_time, 0) / serviceMetrics.length).toFixed(1) : "0";
  
  // Completed / no-shows come from the direct appointments query (useDailyMetrics)
  // using the shared definitions in src/lib/dateRanges.ts. The staff-metrics edge
  // function only counts rows with `staff_id`, which the queue dashboard never sets
  // (it uses assigned_staff_id), so it reported "Completed 0" after a real serve.
  const completedAppointments = Array.isArray(dailyMetrics) ?
    dailyMetrics.reduce((sum, day) => sum + (day.completed ?? 0), 0) : 0;

  const noShows = Array.isArray(dailyMetrics) ?
    dailyMetrics.reduce((sum, day) => sum + (day.no_shows ?? 0), 0) : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground text-sm">Total Appointments</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">
            {totalAppointments}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Scheduled in period, any status</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground text-sm">Average Wait Time</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold">
            {averageWaitTime} <span className="text-lg font-normal">min</span>
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
            {completedAppointments}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Completed in period (by end time)</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground text-sm">No-Shows</span>
            <XCircle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="text-3xl font-bold">
            {noShows}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Marked no-show in period</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryMetrics;
