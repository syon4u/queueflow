
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MapPin } from 'lucide-react';

const AppointmentStatusCard = () => {
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
};

export default AppointmentStatusCard;
