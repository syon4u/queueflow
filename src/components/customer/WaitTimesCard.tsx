
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { formatWaitTime } from '@/lib/queue';

interface ServiceWaitTime {
  service_id: string;
  service_name: string;
  wait_time: number;
  queue_length: number;
}

const WaitTimesCard = () => {
  const [waitTimes, setWaitTimes] = useState<ServiceWaitTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitTimes = async () => {
      try {
        // Get current appointments that are checked in or in progress
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            service_id,
            status,
            scheduled_time,
            check_in_time,
            services!inner (
              name
            )
          `)
          .in('status', ['checked_in', 'in_progress']);

        if (appointmentsError) throw appointmentsError;

        // Calculate wait times by service
        const serviceStats: { [key: string]: { name: string; count: number; totalWait: number } } = {};

        appointments?.forEach(appointment => {
          const serviceId = appointment.service_id;
          const serviceName = appointment.services?.name || 'Unknown Service';
          
          if (!serviceStats[serviceId]) {
            serviceStats[serviceId] = { name: serviceName, count: 0, totalWait: 0 };
          }
          
          serviceStats[serviceId].count++;
          
          // Calculate wait time based on check-in time or scheduled time
          const waitStart = appointment.check_in_time || appointment.scheduled_time;
          const waitTime = Math.max(0, (new Date().getTime() - new Date(waitStart).getTime()) / (1000 * 60));
          serviceStats[serviceId].totalWait += waitTime;
        });

        // Convert to the expected format
        const waitTimesData: ServiceWaitTime[] = Object.entries(serviceStats).map(([serviceId, stats]) => ({
          service_id: serviceId,
          service_name: stats.name,
          wait_time: stats.count > 0 ? Math.round(stats.totalWait / stats.count) : 0,
          queue_length: stats.count
        }));

        setWaitTimes(waitTimesData);
      } catch (error) {
        console.error('Error fetching wait times:', error);
        setWaitTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitTimes();
    
    // Set up realtime subscription for live updates
    const channel = supabase
      .channel('wait-times-updates')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          fetchWaitTimes(); // Refresh when appointments change
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
            {waitTimes.map((service) => (
              <div key={service.service_id} className="flex justify-between items-center p-2 rounded bg-muted/50">
                <div>
                  <div className="font-medium">{service.service_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {service.queue_length} {service.queue_length === 1 ? 'person' : 'people'} waiting
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatWaitTime(service.wait_time)}</div>
                  <div className="text-xs text-muted-foreground">estimated wait</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No wait time information available at the moment.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitTimesCard;
