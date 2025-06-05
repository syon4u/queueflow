
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import type { Appointment } from '@/hooks/use-appointments';
import { SendReminderDialog } from './staff/SendReminderDialog';
import { CreateAppointmentDialog } from './staff/CreateAppointmentDialog';
import { AppointmentTableHeader } from './staff/AppointmentTableHeader';
import { AppointmentTableRow } from './staff/AppointmentTableRow';
import { useAppointmentActions } from '@/hooks/use-appointment-actions';
import { useTranslation } from 'react-i18next';

interface StaffAppointmentTableProps {
  appointments: Appointment[];
  onStatusChange?: () => void;
}

const StaffAppointmentTable: React.FC<StaffAppointmentTableProps> = ({ 
  appointments, 
  onStatusChange 
}) => {
  const { t } = useTranslation();
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { isLoading, updateAppointmentStatus } = useAppointmentActions(onStatusChange);
  
  console.log('StaffAppointmentTable - received appointments:', appointments);
  
  const handleOpenReminderDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReminderDialogOpen(true);
  };

  const handleRefresh = () => {
    if (onStatusChange) {
      onStatusChange();
    }
  };

  const handleAction = (action: string, appointmentId: string) => {
    if (action === 'survey_completed') {
      // Handle survey completion - refresh data
      onStatusChange?.();
      return;
    }
    
    // Handle other actions through the existing system
    const statusMap: Record<string, string> = {
      check_in: 'checked_in',
      start: 'in_progress',
      pause: 'checked_in',
      complete: 'completed',
      cancel: 'cancelled'
    };
    
    if (statusMap[action]) {
      updateAppointmentStatus(appointmentId, statusMap[action] as any);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header with Create Appointment Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t('appointments.title')}</h2>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t('appointments.createNew')}
            </Button>
          </div>
        </div>

        {!appointments.length ? (
          <div className="text-center p-8 text-muted-foreground">
            <p>No active appointments found</p>
            <p className="text-sm mt-2">Appointments created by customers should appear here automatically</p>
          </div>
        ) : (
          <Table>
            <AppointmentTableHeader />
            <TableBody>
              {appointments.map((appointment) => (
                <AppointmentTableRow
                  key={appointment.id}
                  appointment={appointment}
                  onAction={handleAction}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <SendReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        appointment={selectedAppointment}
      />

      <CreateAppointmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </TooltipProvider>
  );
};

export default StaffAppointmentTable;
