
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, TrendingUp } from 'lucide-react';

interface MobileQueueProgressProps {
  currentPosition: number;
  totalInQueue: number;
  estimatedWaitTime: number;
  averageServiceTime: number;
}

export const MobileQueueProgress: React.FC<MobileQueueProgressProps> = ({
  currentPosition,
  totalInQueue,
  estimatedWaitTime,
  averageServiceTime
}) => {
  // Calculate progress percentage (inverted since lower position is better)
  const progressPercentage = Math.max(0, ((totalInQueue - currentPosition + 1) / totalInQueue) * 100);
  
  // Calculate estimated time until service
  const peopleAhead = Math.max(0, currentPosition - 1);
  const estimatedTimeUntilService = peopleAhead * averageServiceTime;

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Queue Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Joined</span>
            <span>Your Turn</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-900">{peopleAhead}</div>
            <div className="text-xs text-gray-600">People Ahead</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-orange-900">
              {Math.round(estimatedTimeUntilService)}m
            </div>
            <div className="text-xs text-gray-600">Est. Time</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-900">
              {averageServiceTime}m
            </div>
            <div className="text-xs text-gray-600">Avg Service</div>
          </div>
        </div>

        {/* Visual Queue Representation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Queue Visualization</h4>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {Array.from({ length: Math.min(totalInQueue, 10) }, (_, index) => {
              const position = index + 1;
              const isCurrentUser = position === currentPosition;
              const isAhead = position < currentPosition;
              const isBehind = position > currentPosition;

              return (
                <div
                  key={position}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${isCurrentUser 
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                      : isAhead 
                        ? 'bg-gray-300 text-gray-600' 
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}
                >
                  {isCurrentUser ? 'You' : position}
                </div>
              );
            })}
            {totalInQueue > 10 && (
              <div className="text-xs text-gray-500 ml-2">
                +{totalInQueue - 10} more
              </div>
            )}
          </div>
        </div>

        {/* Time Breakdown */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Time Breakdown</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">People ahead:</span>
              <span>{peopleAhead}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg service time:</span>
              <span>{averageServiceTime} min</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Estimated wait:</span>
              <span>{Math.round(estimatedWaitTime)} min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
