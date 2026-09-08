import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  // Simplified component without real-time data fetching for now
  // This avoids the authentication/verification code dependencies
  
  if (currentPosition === null || currentPosition === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('public.virtualQueue.tracker.title')}
          </CardTitle>
          <CardDescription>
            {t('public.virtualQueue.tracker.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            {t('public.virtualQueue.tracker.noActive')}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return t('public.virtualQueue.tracker.waitMinutes', { minutes });
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return t('public.virtualQueue.tracker.waitHoursMinutes', { hours, minutes: remainingMinutes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('public.virtualQueue.tracker.title')}
        </CardTitle>
        <CardDescription>
          {t('public.virtualQueue.tracker.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">#{currentPosition}</div>
            <p className="text-sm text-muted-foreground">{t('public.virtualQueue.tracker.positionLabel')}</p>
          </div>
          
          {estimatedWaitTime !== null && estimatedWaitTime !== undefined && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{t('public.virtualQueue.tracker.estimatedWait', { time: formatWaitTime(estimatedWaitTime) })}</span>
            </div>
          )}
          
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {t('public.virtualQueue.tracker.inQueue')}
            </Badge>
          </div>

          {onLeaveQueue && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={onLeaveQueue} className="text-red-600 hover:text-red-700">
                {t('public.virtualQueue.tracker.leave')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QueuePositionTracker;
