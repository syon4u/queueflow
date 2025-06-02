
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatWaitTime } from '@/lib/queue';

interface ServiceWaitTime {
  service_id: string;
  service_name: string;
  avg_wait_minutes: number;
}

const WaitTimesCard = () => {
  const { data: waitTimes, isLoading, error } = useQuery({
    queryKey: ['service-wait-times'],
    queryFn: async () => {
      // Get current day and hour for relevant wait times
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hourOfDay = now.getHours();
      
      const { data, error } = await supabase
        .from('service_wait_times')
        .select(`
          service_id,
          average_wait_time,
          services!inner (
            name
          )
        `)
        .eq('day_of_week', dayOfWeek)
        .eq('hour_of_day', hourOfDay);

      if (error) throw error;

      return (data || []).map(item => ({
        service_id: item.service_id,
        service_name: item.services?.name || 'Unknown Service',
        avg_wait_minutes: item.average_wait_time
      })) as ServiceWaitTime[];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Current Wait Times
        </CardTitle>
        <CardDescription>
          Average wait times by service
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            Unable to load wait times
          </div>
        ) : !waitTimes || waitTimes.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No wait time data available
          </div>
        ) : (
          <div className="space-y-3">
            {waitTimes.map((service) => (
              <div key={service.service_id} className="flex justify-between items-center">
                <span className="text-sm font-medium">{service.service_name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatWaitTime(service.avg_wait_minutes)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitTimesCard;
