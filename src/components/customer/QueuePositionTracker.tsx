import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';

interface QueuePositionTrackerProps {
  currentPosition?: number;
  estimatedWaitTime?: number;
  onLeaveQueue?: () => void;
}

const QueuePositionTracker: React.FC<QueuePositionTrackerProps> = ({
  currentPosition,
  estimatedWaitTime,
  onLeaveQueue
}) => {
  // Simplified component without real-time data fetching for now
  // This avoids the authentication/verification code dependencies
  
  if (currentPosition === null || currentPosition === undefined) {
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

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

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
            <div className="text-3xl font-bold text-primary">#{currentPosition}</div>
            <p className="text-sm text-muted-foreground">Position in queue</p>
          </div>
          
          {estimatedWaitTime !== null && estimatedWaitTime !== undefined && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated wait: {formatWaitTime(estimatedWaitTime)}</span>
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
