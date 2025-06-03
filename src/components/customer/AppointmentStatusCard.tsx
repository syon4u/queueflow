
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MapPin, User } from 'lucide-react';
import { useRealtimeAppointments } from '@/hooks/use-realtime-appointments';
import { format } from 'date-fns';

const AppointmentStatusCard = () => {
  const { appointments, isLoading, error } = useRealtimeAppointments();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Status
          </CardTitle>
          <CardDescription>
            Check your current appointment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse">Loading appointment status...</div>
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
            <Calendar className="h-5 w-5" />
            Appointment Status
          </CardTitle>
          <CardDescription>
            Check your current appointment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Unable to load appointment status
          </div>
        </CardContent>
      </Card>
    );
  }

  // For demo purposes, show the first active appointment
  // In a real app, filter by authenticated user
  const userAppointment = appointments.find(apt => 
    apt.status === 'scheduled' || apt.status === 'checked_in' || apt.status === 'in_progress'
  );

  if (!userAppointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Status
          </CardTitle>
          <CardDescription>
            Check your current appointment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Active Appointment</p>
            <p className="text-sm">
              Schedule an appointment to see your status here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'checked_in': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'checked_in': return 'Checked In';
      case 'in_progress': return 'In Progress';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Appointment Status
        </CardTitle>
        <CardDescription>
          Your current appointment details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Badge variant="outline" className={getStatusColor(userAppointment.status)}>
            {getStatusText(userAppointment.status)}
          </Badge>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(userAppointment.scheduled_time), 'MMM dd, yyyy at h:mm a')}
            </span>
          </div>
          
          {userAppointment.locations && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{userAppointment.locations.name}</span>
            </div>
          )}
          
          {userAppointment.services && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{userAppointment.services.name}</span>
            </div>
          )}
          
          {userAppointment.check_in_time && (
            <div className="text-xs text-muted-foreground">
              Checked in: {format(new Date(userAppointment.check_in_time), 'h:mm a')}
            </div>
          )}
        </div>
        
        <div className="text-xs text-center text-muted-foreground border-t pt-2">
          Confirmation: APT-{userAppointment.id.slice(0, 8).toUpperCase()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentStatusCard;
