
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueue, Customer } from '@/context/QueueContext';
import { formatWaitTime } from '@/lib/queue';

interface ServiceWaitTime {
  service_name: string;
  wait_time: number;
  queue_length: number;
}

const WaitTimesCard = () => {
  const [waitTimes, setWaitTimes] = useState<ServiceWaitTime[]>([]);
  const [loading, setLoading] = useState(true);
  const { customers, stats } = useQueue();

  useEffect(() => {
    const calculateWaitTimes = () => {
      try {
        setLoading(true);
        
        // Get waiting customers and group by service
        const waitingCustomers = customers.filter(c => c.status === 'waiting');
        const serviceGroups: { [key: string]: Customer[] } = {};
        
        waitingCustomers.forEach(customer => {
          const service = customer.service || 'General Service';
          if (!serviceGroups[service]) {
            serviceGroups[service] = [];
          }
          serviceGroups[service].push(customer);
        });

        // Calculate wait times for each service
        const waitTimesData: ServiceWaitTime[] = Object.entries(serviceGroups).map(([serviceName, customers]) => {
          const queueLength = customers.length;
          
          // Calculate average wait time based on queue position
          const totalWaitTime = customers.reduce((acc, customer, index) => {
            // Position in queue (1-based) * estimated service time per customer
            const positionWaitTime = (index + 1) * 15; // 15 minutes per customer
            return acc + positionWaitTime;
          }, 0);
          
          const avgWaitTime = queueLength > 0 ? Math.round(totalWaitTime / queueLength) : 0;
          
          return {
            service_name: serviceName,
            wait_time: avgWaitTime,
            queue_length: queueLength
          };
        });

        // Sort by queue length (highest first)
        waitTimesData.sort((a, b) => b.queue_length - a.queue_length);
        
        setWaitTimes(waitTimesData);
      } catch (error) {
        console.error('Error calculating wait times:', error);
        setWaitTimes([]);
      } finally {
        setLoading(false);
      }
    };

    calculateWaitTimes();
  }, [customers]); // Recalculate when customers change

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Wait Times</CardTitle>
        <CardDescription>
          Estimated wait times for available services
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : waitTimes.length > 0 ? (
          <div className="space-y-3">
            {waitTimes.map((service) => (
              <div key={service.service_name} className="flex justify-between items-center p-2 rounded bg-muted/50">
                <div>
                  <div className="font-medium">{service.service_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {service.queue_length} {service.queue_length === 1 ? 'person' : 'people'} waiting
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {service.wait_time === 0 ? 'No wait' : formatWaitTime(service.wait_time)}
                  </div>
                  <div className="text-xs text-muted-foreground">estimated wait</div>
                </div>
              </div>
            ))}
            
            {stats.waitingCustomers > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm text-blue-700 text-center">
                  <strong>Overall:</strong> {stats.waitingCustomers} customers waiting, 
                  avg {Math.round(stats.averageWaitTime)}m wait time
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No customers currently waiting. Wait times will appear when customers join the queue.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitTimesCard;
