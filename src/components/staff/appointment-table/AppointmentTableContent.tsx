
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { AppointmentTableHeader } from '../AppointmentTableHeader';
import { AppointmentTableRow } from '../AppointmentTableRow';
import type { Appointment } from '@/hooks/use-appointments';

interface AppointmentTableContentProps {
  appointments: Appointment[];
  isLoading: boolean;
  onAction: (action: string, appointmentId: string) => void;
  onCreateAppointment: () => void;
}

export const AppointmentTableContent: React.FC<AppointmentTableContentProps> = ({
  appointments,
  isLoading,
  onAction,
  onCreateAppointment
}) => {
  if (isLoading) {
    return (
      <Card className="shadow-sm border-0 bg-white rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center p-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-500 mt-4 font-medium">Loading appointments...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="shadow-sm border-0 bg-white rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="text-center p-12 bg-gray-50">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500 mb-6">
                Create your first appointment to get started
              </p>
              <Button onClick={onCreateAppointment} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create New Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 bg-white rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <AppointmentTableHeader />
            <TableBody>
              {appointments.map((appointment) => (
                <AppointmentTableRow
                  key={appointment.id}
                  appointment={appointment}
                  onAction={onAction}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
