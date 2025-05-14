
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface Appointment {
  id: string;
  status: string;
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  service: {
    name: string;
    duration: number;
  };
  location: {
    name: string;
  };
}

interface AppointmentListProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
  isLoading: boolean;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-500';
    case 'checked_in': return 'bg-yellow-500';
    case 'in_progress': return 'bg-orange-500';
    case 'completed': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    case 'no_show': return 'bg-gray-500';
    default: return 'bg-gray-300';
  }
};

export const formatDateTime = (dateTime: string) => {
  try {
    return format(new Date(dateTime), 'PPp');
  } catch (e) {
    return 'Invalid date';
  }
};

const AppointmentList = ({ appointments, onCancel, isLoading }: AppointmentListProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyAppointments />
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className={appointment.status === 'cancelled' ? 'opacity-60' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={getStatusColor(appointment.status)}>{t(`appointments.status.${appointment.status}`)}</Badge>
                <CardTitle className="mt-2">{appointment.service.name}</CardTitle>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{t('appointments.location')}</p>
                <p>{appointment.location.name}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{formatDateTime(appointment.scheduled_time)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{t('appointments.duration')}: {appointment.service.duration} {t('appointments.minutes')}</span>
              </div>
            </div>
            
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onCancel(appointment.id)}
                >
                  {t('appointments.cancel')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const EmptyAppointments = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="text-center p-12">
      <CardContent className="pt-6">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('appointments.noAppointments')}</h2>
        <p className="text-muted-foreground mb-6">{t('appointments.bookAppointment')}</p>
        <Button asChild>
          <a href="/new-appointment">{t('appointments.scheduleNow')}</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentList;
