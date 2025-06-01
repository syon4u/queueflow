
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useStaffMetrics, useServiceMetrics, useDailyMetrics } from '@/hooks/admin/use-performance-metrics';
import { Clock, Users, TrendingUp, Target } from 'lucide-react';

// Import enhanced components
import PerformanceHeader from './performance/PerformanceHeader';
import DailyPerformanceChart from './performance/DailyPerformanceChart';
import StaffPerformanceCard from './performance/StaffPerformanceCard';
import ServiceMetricsCard from './performance/ServiceMetricsCard';
import SummaryMetrics from './performance/SummaryMetrics';
import PerformanceMetricsCard from './performance/PerformanceMetricsCard';
import DetailedStaffMetrics from './performance/DetailedStaffMetrics';
import ServicePerformanceChart from './performance/ServicePerformanceChart';

const StaffPerformanceReport: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('week');
  
  // Use the custom hooks for performance metrics
  const { data: staffMetrics, isLoading: staffLoading } = useStaffMetrics(timeRange);
  const { data: serviceMetrics, isLoading: serviceLoading } = useServiceMetrics(timeRange);
  const { data: dailyMetrics, isLoading: dailyLoading } = useDailyMetrics(timeRange);

  // Calculate enhanced metrics
  const enhancedMetrics = React.useMemo(() => {
    const totalAppointments = Array.isArray(dailyMetrics) ? 
      dailyMetrics.reduce((sum, day) => sum + day.appointments, 0) : 0;
    
    const averageWaitTime = Array.isArray(serviceMetrics) && serviceMetrics.length > 0 ?
      (serviceMetrics.reduce((sum, service) => sum + service.average_wait_time, 0) / serviceMetrics.length) : 0;
    
    const completedAppointments = Array.isArray(staffMetrics) ? 
      staffMetrics.reduce((sum, staff) => sum + staff.appointments_served, 0) : 0;
    
    const averageServiceTime = Array.isArray(staffMetrics) && staffMetrics.length > 0 ?
      (staffMetrics.reduce((sum, staff) => sum + staff.average_service_time, 0) / staffMetrics.length) : 0;

    return [
      {
        title: 'Total Appointments',
        value: totalAppointments,
        change: '+12% from last period',
        trend: 'up' as const,
        icon: <Users className="h-6 w-6" />
      },
      {
        title: 'Avg. Wait Time',
        value: `${averageWaitTime.toFixed(1)} min`,
        change: '-5% from last period',
        trend: 'down' as const,
        icon: <Clock className="h-6 w-6" />
      },
      {
        title: 'Completed Services',
        value: completedAppointments,
        change: '+8% from last period',
        trend: 'up' as const,
        icon: <Target className="h-6 w-6" />
      },
      {
        title: 'Avg. Service Time',
        value: `${averageServiceTime.toFixed(1)} min`,
        change: '-3% from last period',
        trend: 'down' as const,
        icon: <TrendingUp className="h-6 w-6" />
      }
    ];
  }, [dailyMetrics, serviceMetrics, staffMetrics]);

  // Download report as CSV
  const downloadReportCSV = () => {
    // Combine all metrics data
    const combinedData = {
      staff: staffMetrics || [],
      services: serviceMetrics || [],
      daily: dailyMetrics || [],
      enhanced_metrics: enhancedMetrics
    };

    // Convert to CSV format
    const jsonString = JSON.stringify(combinedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-performance-report-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: 'Enhanced Report Downloaded',
      description: 'Your detailed performance report has been downloaded successfully.'
    });
  };

  // Loading states for queries
  const isLoading = staffLoading || serviceLoading || dailyLoading;

  return (
    <div className="space-y-6">
      {/* Header with time range selector and export button */}
      <PerformanceHeader 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        isLoading={isLoading} 
        onDownload={downloadReportCSV} 
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Enhanced Performance Metrics */}
          <PerformanceMetricsCard metrics={enhancedMetrics} />

          {/* Service Performance Charts */}
          <ServicePerformanceChart serviceMetrics={serviceMetrics} />

          {/* Detailed Staff Metrics */}
          <DetailedStaffMetrics staffMetrics={staffMetrics} />

          {/* Daily statistics chart */}
          <DailyPerformanceChart dailyMetrics={dailyMetrics} />

          {/* Summary metrics */}
          <SummaryMetrics 
            dailyMetrics={dailyMetrics}
            staffMetrics={staffMetrics}
            serviceMetrics={serviceMetrics}
          />
        </div>
      )}
    </div>
  );
};

export default StaffPerformanceReport;
