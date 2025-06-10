
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { useRealtimeAppointments } from '@/hooks/use-realtime-appointments';
import { formatWaitTime } from '@/lib/queue';

interface QueuePositionTrackerProps {
  currentPosition?: number;
  estimatedWaitTime?: number;
  onLeaveQueue?: () => void;
}

const QueuePositionTracker: React.FC<QueuePositionTrackerProps> = ({
  currentPosition: propPosition,
  estimatedWaitTime: propWaitTime,
  onLeaveQueue
}) => {
  const { userPosition, estimatedWaitTime, isLoading, error } = useRealtimeAppointments();

  // Use props if provided, otherwise fall back to hook data
  const position = propPosition !== undefined ? propPosition : userPosition;
  const waitTime = propWaitTime !== undefined ? propWaitTime : estimatedWaitTime;

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

  if (position === null || position === undefined) {
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
            <div className="text-3xl font-bold text-primary">#{position}</div>
            <p className="text-sm text-muted-foreground">Position in queue</p>
          </div>
          
          {waitTime !== null && waitTime !== undefined && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated wait: {formatWaitTime(waitTime)}</span>
            </div>
          )}
          
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              In Queue
            </Badge>
          </div>

          {onLeaveQueue && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={onLeaveQueue} className="text-red-600 hover:text-red-700">
                Leave Queue
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QueuePositionTracker;
