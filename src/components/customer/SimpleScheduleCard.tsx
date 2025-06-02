
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import SimpleAppointmentForm from './SimpleAppointmentForm';

interface SimpleScheduleCardProps {
  onAppointmentRequested: (customerInfo: any) => void;
}

const SimpleScheduleCard = ({ onAppointmentRequested }: SimpleScheduleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule an Appointment
        </CardTitle>
        <CardDescription>
          Request an appointment with Broward County Consumer Protection Division
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SimpleAppointmentForm onSubmit={onAppointmentRequested} />
      </CardContent>
    </Card>
  );
};

export default SimpleScheduleCard;
