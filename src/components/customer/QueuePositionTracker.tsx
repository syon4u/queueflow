
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { useRealtimeAppointments } from '@/hooks/use-realtime-appointments';
import { useAuth } from '@/context/AuthContext';
import { formatWaitTime } from '@/lib/queue';

const QueuePositionTracker = () => {
  const { user } = useAuth();
  const { userPosition, estimatedWaitTime, isLoading, error } = useRealtimeAppointments();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Queue Position
          </CardTitle>
          <CardDescription>
            Your current position in the queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse">Loading your queue position...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Queue Position
          </CardTitle>
          <CardDescription>
            Your current position in the queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Unable to load queue information
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user || userPosition === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Queue Position
          </CardTitle>
          <CardDescription>
            Your current position in the queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No active appointment found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Queue Position
        </CardTitle>
        <CardDescription>
          Your current position in the queue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">#{userPosition}</div>
            <p className="text-sm text-muted-foreground">Position in queue</p>
          </div>
          
          {estimatedWaitTime !== null && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated wait: {formatWaitTime(estimatedWaitTime)}</span>
            </div>
          )}
          
          <div className="flex justify-center">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              In Queue
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueuePositionTracker;
