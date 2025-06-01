import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

// Define the types that we were trying to import
export interface StaffMetric {
  staff_id: string;
  staff_name: string;
  appointments_served: number;
  average_service_time: number;
  no_shows: number;
}

export interface ServiceMetric {
  service_id: string;
  service_name: string;
  appointments_count: number;
  average_wait_time: number;
}

export interface DailyMetric {
  date: string;
  appointments: number;
  wait_time: number;
}

// Mock data generators
const generateMockStaffMetrics = (): StaffMetric[] => {
  const staffNames = ['John Smith', 'Maria Garcia', 'Robert Johnson', 'Sarah Williams', 'Michael Brown'];
  
  return staffNames.map((name, index) => ({
    staff_id: `staff-${index + 1}`,
    staff_name: name,
    appointments_served: Math.floor(Math.random() * 50) + 10,
    average_service_time: Math.floor(Math.random() * 20) + 5,
    no_shows: Math.floor(Math.random() * 5)
  }));
};

const generateMockServiceMetrics = (): ServiceMetric[] => {
  const serviceNames = ['License Renewal', 'ID Card', 'Vehicle Registration', 'Property Tax', 'Business License'];
  
  return serviceNames.map((name, index) => ({
    service_id: `service-${index + 1}`,
    service_name: name,
    appointments_count: Math.floor(Math.random() * 100) + 20,
    average_wait_time: Math.floor(Math.random() * 30) + 5
  }));
};

const generateMockDailyMetrics = (days: number): DailyMetric[] => {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    result.push({
      date: format(date, 'yyyy-MM-dd'),
      appointments: Math.floor(Math.random() * 50) + 10,
      wait_time: Math.floor(Math.random() * 20) + 5
    });
  }
  
  return result;
};

// Hook for fetching staff performance metrics
export const useStaffMetrics = (timeRange: string, locationId?: string) => {
  return useQuery({
    queryKey: ['staff-metrics', timeRange, locationId],
    queryFn: async () => {
      // Return mock data for demo
      return generateMockStaffMetrics();
    }
  });
};

// Hook for fetching service performance metrics
export const useServiceMetrics = (timeRange: string, locationId?: string) => {
  return useQuery({
    queryKey: ['service-metrics', timeRange, locationId],
    queryFn: async () => {
      // Return mock data for demo
      return generateMockServiceMetrics();
    }
  });
};

// Hook for fetching daily appointment metrics
export const useDailyMetrics = (timeRange: string, locationId?: string) => {
  return useQuery({
    queryKey: ['daily-metrics', timeRange, locationId],
    queryFn: async () => {
      // Calculate number of days based on timeRange
      let days = 7;
      switch (timeRange) {
        case 'today': days = 1; break;
        case 'yesterday': days = 2; break;
        case 'week': days = 7; break;
        case 'month': days = 30; break;
        case 'quarter': days = 90; break;
        default: days = parseInt(timeRange) || 7;
      }
      
      // Return mock data for demo
      const data = generateMockDailyMetrics(days);
      
      // Format dates for display
      return data.map(item => ({
        ...item,
        date: format(new Date(item.date), 'MMM dd')
      }));
    }
  });
};