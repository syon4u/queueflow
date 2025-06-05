
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, CheckCircle, XCircle, RefreshCw, Settings } from 'lucide-react';

interface EnhancedQueueDashboardProps {
  appointments: any[];
  onRefresh: () => void;
  onStatusChange: () => void;
}

export const EnhancedQueueDashboard: React.FC<EnhancedQueueDashboardProps> = ({
  appointments,
  onRefresh,
  onStatusChange
}) => {
  const waitingCount = appointments.filter(apt => apt.status === 'waiting').length;
  const inProgressCount = appointments.filter(apt => apt.status === 'in_progress').length;
  const completedToday = appointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Queue Management</h1>
          <p className="text-gray-600 mt-1">Advanced queue operations with real-time updates</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Users className="h-3 w-3 mr-1" />
            Enhanced Queue
          </Badge>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingCount}</div>
            <p className="text-xs text-muted-foreground">Currently waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Being served</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground">Successfully served</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">All appointments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enhanced Queue Controls</CardTitle>
          <CardDescription>Advanced queue management with real-time capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={onStatusChange}>Update Status</Button>
            <Button variant="outline">Call Next</Button>
            <Button variant="outline">Bulk Actions</Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-1" />
              Queue Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Quick overview of current appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {appointments.slice(0, 5).map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">Customer #{index + 1}</span>
                    <Badge variant="outline" className="ml-2">
                      {appointment.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
