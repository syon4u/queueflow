
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatusCount {
  scheduled: number;
  checked_in: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

interface AppointmentStatusCardsProps {
  statusCounts: StatusCount;
}

export const AppointmentStatusCards: React.FC<AppointmentStatusCardsProps> = ({
  statusCounts
}) => {
  const statusConfig = [
    {
      label: 'Scheduled',
      count: statusCounts.scheduled,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Checked In',
      count: statusCounts.checked_in,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    },
    {
      label: 'In Progress',
      count: statusCounts.in_progress,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    {
      label: 'Completed',
      count: statusCounts.completed,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200'
    },
    {
      label: 'Cancelled',
      count: statusCounts.cancelled,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    {
      label: 'No Show',
      count: statusCounts.no_show,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statusConfig.map(status => (
        <Card 
          key={status.label} 
          className={`${status.bgColor} ${status.borderColor} border-2 hover:shadow-md transition-shadow`}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${status.textColor} mb-1`}>
                {status.count}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {status.label}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
