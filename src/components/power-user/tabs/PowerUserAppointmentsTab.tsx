
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Users, Clock } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const PowerUserAppointmentsTab: React.FC = () => {
  const { appointments, customers, isLoading } = useAppData();

  // Filter for today's appointments
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(apt => 
    new Date(apt.scheduled_time).toDateString() === today
  );

  // Calculate queue status
  const queueStats = {
    waiting: appointments.filter(apt => apt.status === 'checked_in').length,
    inProgress: appointments.filter(apt => apt.status === 'in_progress').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
  };

  // Calculate performance metrics
  const completedToday = todaysAppointments.filter(apt => apt.status === 'completed');
  const avgServiceTime = completedToday.length > 0 
    ? Math.round(completedToday.reduce((acc, apt) => {
        if (apt.start_time && apt.end_time) {
          const duration = new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime();
          return acc + (duration / 60000); // Convert to minutes
        }
        return acc;
      }, 0) / completedToday.length)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Today's Appointments & Operations</h2>
          <p className="text-sm text-gray-500">Manage appointments, check-ins, and customer interactions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule ({todaysAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {todaysAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                todaysAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">
                        {appointment.customer?.first_name} {appointment.customer?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.service?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(appointment.scheduled_time), 'h:mm a')}
                      </p>
                      <Badge 
                        variant={
                          appointment.status === 'completed' ? 'default' :
                          appointment.status === 'in_progress' ? 'secondary' :
                          appointment.status === 'checked_in' ? 'outline' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {appointment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              {todaysAppointments.length > 5 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  And {todaysAppointments.length - 5} more appointments...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Currently Waiting</span>
                <span className="font-medium">{queueStats.waiting} customers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Being Served</span>
                <span className="font-medium">{queueStats.inProgress} customers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed Today</span>
                <span className="font-medium">{queueStats.completed} customers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Available</span>
                <span className="font-medium">
                  {queueStats.waiting > 0 ? `${queueStats.waiting * 15} min` : 'Now'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Performance Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium">{completedToday.length} appointments</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Service Time</span>
                <span className="font-medium">{avgServiceTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="font-medium">{customers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency Rate</span>
                <span className="font-medium">
                  {todaysAppointments.length > 0 
                    ? Math.round((completedToday.length / todaysAppointments.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Check In Customer
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              View Queue
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Add Walk-in
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Schedule Follow-up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
