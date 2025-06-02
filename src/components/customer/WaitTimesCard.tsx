
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { formatWaitTime } from '@/lib/queue';

interface ServiceWaitTime {
  service_name: string;
  location_name: string;
  wait_time: number;
  queue_length: number;
}

const WaitTimesCard = () => {
  const [waitTimes, setWaitTimes] = useState<ServiceWaitTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitTimes = async () => {
      try {
        setLoading(true);
        
        // Get current checked-in appointments with service and location info
        const { data: appointments, error } = await supabase
          .from('appointments')
          .select(`
            id,
            status,
            check_in_time,
            services (name),
            locations (name)
          `)
          .in('status', ['checked_in', 'in_progress'])
          .order('check_in_time', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
          return;
        }

        // Group by service and location
        const serviceGroups: { [key: string]: any[] } = {};
        
        (appointments || []).forEach(appointment => {
          const key = `${appointment.services?.name || 'Unknown'} - ${appointment.locations?.name || 'Unknown'}`;
          if (!serviceGroups[key]) {
            serviceGroups[key] = [];
          }
          serviceGroups[key].push(appointment);
        });

        // Calculate wait times
        const waitTimesData: ServiceWaitTime[] = Object.entries(serviceGroups).map(([key, apps]) => {
          const [serviceName, locationName] = key.split(' - ');
          const queueLength = apps.length;
          
          // Calculate average wait time based on queue position
          const totalWaitTime = apps.reduce((acc, app, index) => {
            const position = index + 1;
            const estimatedWaitTime = position * 15; // 15 minutes per person estimate
            return acc + estimatedWaitTime;
          }, 0);
          
          const avgWaitTime = queueLength > 0 ? Math.round(totalWaitTime / queueLength) : 0;
          
          return {
            service_name: serviceName,
            location_name: locationName,
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

    fetchWaitTimes();

    // Set up realtime subscription for appointment changes
    const channel = supabase
      .channel('appointments-wait-times')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'appointments'
        }, 
        () => {
          fetchWaitTimes(); // Refetch when appointments change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
            {waitTimes.map((service, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/50">
                <div>
                  <div className="font-medium">{service.service_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {service.location_name} • {service.queue_length} {service.queue_length === 1 ? 'person' : 'people'} waiting
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
