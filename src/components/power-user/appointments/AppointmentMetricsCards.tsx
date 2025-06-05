
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

interface AppointmentMetricsCardsProps {
  todaysCount: number;
  queueWaiting: number;
  completed: number;
  avgServiceTime: number;
}

export const AppointmentMetricsCards: React.FC<AppointmentMetricsCardsProps> = ({
  todaysCount,
  queueWaiting,
  completed,
  avgServiceTime
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Today's Schedule</p>
              <p className="text-3xl font-bold text-blue-900">{todaysCount}</p>
              <p className="text-xs text-blue-600 mt-1">Total appointments</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700 mb-1">In Queue</p>
              <p className="text-3xl font-bold text-amber-900">{queueWaiting}</p>
              <p className="text-xs text-amber-600 mt-1">Customers waiting</p>
            </div>
            <div className="p-3 bg-amber-200 rounded-lg">
              <Users className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-900">{completed}</p>
              <p className="text-xs text-green-600 mt-1">Today's total</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Avg Service Time</p>
              <p className="text-3xl font-bold text-purple-900">{avgServiceTime}</p>
              <p className="text-xs text-purple-600 mt-1">Minutes per customer</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Clock className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
