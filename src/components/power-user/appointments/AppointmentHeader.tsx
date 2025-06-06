
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AppointmentHeaderProps {
  onScheduleAppointment: () => void;
}

export const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  onScheduleAppointment
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointments Management</h2>
        <p className="text-gray-600">Monitor today's schedule and queue status</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onScheduleAppointment} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>
    </div>
  );
};
