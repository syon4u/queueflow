
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'checked_in': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'scheduled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointments Management</h2>
          <p className="text-gray-600">Monitor today's schedule, queue status, and operational performance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Today's Schedule</p>
                <p className="text-3xl font-bold text-blue-900">{todaysAppointments.length}</p>
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
                <p className="text-3xl font-bold text-amber-900">{queueStats.waiting}</p>
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
                <p className="text-3xl font-bold text-green-900">{queueStats.completed}</p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Today's Schedule
                <Badge variant="outline" className="ml-auto">
                  {todaysAppointments.length} appointments
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {todaysAppointments.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                  <p className="text-gray-500 mb-4">Schedule your first appointment to get started</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {todaysAppointments.map((appointment, index) => (
                    <div 
                      key={appointment.id} 
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === todaysAppointments.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {appointment.customer?.first_name} {appointment.customer?.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">{appointment.service?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(appointment.scheduled_time), 'h:mm a')} • {appointment.service?.duration} min
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(appointment.status)} text-xs font-medium`}
                        >
                          {formatStatusText(appointment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Performance Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {todaysAppointments.length > 0 
                    ? Math.round((completedToday.length / todaysAppointments.length) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Active Customers</span>
                <span className="font-semibold text-gray-900">{queueStats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Queue Length</span>
                <span className="font-semibold text-gray-900">{queueStats.waiting}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="font-semibold text-gray-900">{customers.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <Calendar className="h-4 w-4 mr-3" />
                Check In Customer
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Users className="h-4 w-4 mr-3" />
                View Full Queue
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Clock className="h-4 w-4 mr-3" />
                Add Walk-in
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Plus className="h-4 w-4 mr-3" />
                Schedule Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
