
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, RefreshCw } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { format } from 'date-fns';

interface CustomerAppointmentHistoryProps {
  customerId: string;
  customerName: string;
}

export const CustomerAppointmentHistory: React.FC<CustomerAppointmentHistoryProps> = ({
  customerId,
  customerName
}) => {
  const { appointments, isLoading, refetch } = useAppData();

  const customerAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.customer_id === customerId)
      .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
  }, [appointments, customerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked_in':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Appointment History</h3>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Appointment History</h3>
          <p className="text-sm text-muted-foreground">{customerName}</p>
        </div>
        <Button
          onClick={refetch}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {customerAppointments.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Appointments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {customerAppointments.filter(apt => apt.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {customerAppointments.filter(apt => apt.status === 'cancelled').length}
            </div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {customerAppointments.filter(apt => apt.status === 'no_show').length}
            </div>
            <div className="text-sm text-muted-foreground">No Shows</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {customerAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointment History</h3>
              <p className="text-gray-500">
                This customer hasn't had any appointments yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          customerAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      {format(new Date(appointment.scheduled_time), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(appointment.scheduled_time), 'h:mm a')}
                      </div>
                      {appointment.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {appointment.location.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Service Information */}
                  <div>
                    <div className="font-medium text-gray-900">
                      {appointment.service?.name || 'Unknown Service'}
                    </div>
                    {appointment.service?.description && (
                      <div className="text-sm text-muted-foreground">
                        {appointment.service.description}
                      </div>
                    )}
                  </div>

                  {/* Timing Information */}
                  {(appointment.check_in_time || appointment.start_time || appointment.end_time) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      {appointment.check_in_time && (
                        <div>
                          <span className="font-medium">Checked In:</span>{' '}
                          {format(new Date(appointment.check_in_time), 'h:mm a')}
                        </div>
                      )}
                      {appointment.start_time && (
                        <div>
                          <span className="font-medium">Started:</span>{' '}
                          {format(new Date(appointment.start_time), 'h:mm a')}
                        </div>
                      )}
                      {appointment.end_time && (
                        <div>
                          <span className="font-medium">Completed:</span>{' '}
                          {format(new Date(appointment.end_time), 'h:mm a')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {(appointment.notes || appointment.reason_for_visit) && (
                    <div className="space-y-2">
                      {appointment.reason_for_visit && (
                        <div>
                          <span className="font-medium text-sm">Reason for Visit:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {appointment.reason_for_visit}
                          </p>
                        </div>
                      )}
                      {appointment.notes && (
                        <div>
                          <span className="font-medium text-sm">Notes:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
