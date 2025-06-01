
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Appointment } from '@/hooks/use-appointments';
import { SendReminderDialog } from './staff/SendReminderDialog';
import { AppointmentTableHeader } from './staff/AppointmentTableHeader';
import { AppointmentTableRow } from './staff/AppointmentTableRow';
import { useAppointmentActions } from '@/hooks/use-appointment-actions';

interface StaffAppointmentTableProps {
  appointments: Appointment[];
  onStatusChange?: () => void;
}

const StaffAppointmentTable: React.FC<StaffAppointmentTableProps> = ({ 
  appointments, 
  onStatusChange 
}) => {
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { isLoading, updateAppointmentStatus } = useAppointmentActions(onStatusChange);
  
  const handleOpenReminderDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReminderDialogOpen(true);
  };

  if (!appointments.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No active appointments found</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Table>
        <AppointmentTableHeader />
        <TableBody>
          {appointments.map((appointment) => (
            <AppointmentTableRow
              key={appointment.id}
              appointment={appointment}
              isLoading={isLoading[appointment.id]}
              onUpdateStatus={updateAppointmentStatus}
              onOpenReminderDialog={handleOpenReminderDialog}
            />
          ))}
        </TableBody>
      </Table>

      <SendReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        appointment={selectedAppointment}
      />
    </TooltipProvider>
  );
};

export default StaffAppointmentTable;
