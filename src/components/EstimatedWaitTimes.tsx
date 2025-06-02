
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatWaitTime } from '@/lib/queue';
import { toast } from 'sonner';
import { useQueue } from '@/context/QueueContext';

type ServiceWaitTimeData = {
  service_name: string;
  current_queue_length: number;
  estimated_wait_minutes: number;
  service_id: string;
};

const EstimatedWaitTimes: React.FC = () => {
  const [serviceWaitTimes, setServiceWaitTimes] = useState<ServiceWaitTimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { customers, stats } = useQueue();

  // Calculate wait times based on current queue data
  const calculateCurrentWaitTimes = () => {
    const waitingCustomers = customers.filter(c => c.status === 'waiting');
    const serviceGroups: { [key: string]: number } = {};
    
    // Group customers by service
    waitingCustomers.forEach(customer => {
      const service = customer.service || 'General Service';
      serviceGroups[service] = (serviceGroups[service] || 0) + 1;
    });

    // Convert to wait time data
    const waitTimeData: ServiceWaitTimeData[] = Object.entries(serviceGroups).map(([serviceName, queueLength]) => ({
      service_name: serviceName,
      current_queue_length: queueLength,
      estimated_wait_minutes: queueLength * 15, // 15 minutes per customer estimate
      service_id: serviceName.toLowerCase().replace(/\s+/g, '-')
    }));

    return waitTimeData.sort((a, b) => b.current_queue_length - a.current_queue_length);
  };

  useEffect(() => {
    const fetchWaitTimes = async () => {
      try {
        setIsLoading(true);
        
        // First, try to get historical wait times from the database
        const { data: historicalData, error: historicalError } = await supabase
          .from('service_wait_times')
          .select(`
            service_id,
            average_wait_time,
            day_of_week,
            hour_of_day
          `)
          .eq('day_of_week', new Date().getDay())
          .eq('hour_of_day', new Date().getHours())
          .limit(10);

        if (historicalError) {
          console.error('Error fetching historical wait times:', historicalError);
        }

        // Get current queue-based wait times
        const currentWaitTimes = calculateCurrentWaitTimes();
        
        // If we have current queue data, use that; otherwise show historical data
        if (currentWaitTimes.length > 0) {
          setServiceWaitTimes(currentWaitTimes);
        } else {
          // Fallback to showing some default services with zero wait times
          const defaultServices = [
            'Business License',
            'Code Violation',
            'General Inquiry',
            'Permit Application',
            'Document Review'
          ];
          
          const defaultWaitTimes: ServiceWaitTimeData[] = defaultServices.map(service => ({
            service_name: service,
            current_queue_length: 0,
            estimated_wait_minutes: 0,
            service_id: service.toLowerCase().replace(/\s+/g, '-')
          }));
          
          setServiceWaitTimes(defaultWaitTimes);
        }
      } catch (err) {
        console.error('Failed to fetch wait times:', err);
        toast.error('Failed to load wait time estimates');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWaitTimes();
    
    // Refresh wait times every 30 seconds
    const interval = setInterval(fetchWaitTimes, 30000);
    
    return () => clearInterval(interval);
  }, [customers]); // Re-calculate when customers change

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-qflow-teal" />
          Current Wait Times
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse h-20 w-full bg-muted rounded-md"></div>
          </div>
        ) : serviceWaitTimes.length > 0 ? (
          <div className="space-y-3">
            {serviceWaitTimes.map((item, index) => (
              <div key={item.service_id} className="flex justify-between items-center p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.service_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.current_queue_length} {item.current_queue_length === 1 ? 'person' : 'people'} waiting
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary" 
                    className={`${
                      item.estimated_wait_minutes === 0 
                        ? 'bg-green-100 text-green-800' 
                        : item.estimated_wait_minutes <= 15 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.estimated_wait_minutes === 0 ? 'No wait' : formatWaitTime(item.estimated_wait_minutes)}
                  </Badge>
                </div>
              </div>
            ))}
            
            {stats.waitingCustomers > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 font-medium">
                    Total customers in queue: {stats.waitingCustomers}
                  </span>
                  <span className="text-blue-600">
                    Avg wait: {Math.round(stats.averageWaitTime)}m
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="font-medium">No customers currently waiting</p>
            <p className="text-sm">Wait times will appear when customers join the queue</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimatedWaitTimes;
