
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFilteredAppointments } from '@/hooks/use-filtered-appointments';
import { AppointmentFilters } from './AppointmentFilters';
import { SendReminderDialog } from './SendReminderDialog';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { AppointmentTableHeader } from './AppointmentTableHeader';
import { AppointmentTableRow } from './AppointmentTableRow';
import { useAppointmentActions } from '@/hooks/use-appointment-actions';
import { useTranslation } from 'react-i18next';
import type { Appointment } from '@/hooks/use-appointments';

const EnhancedAppointmentTable: React.FC = () => {
  const { t } = useTranslation();
  const { 
    appointments, 
    allAppointments, 
    isLoading: appointmentsLoading, 
    refreshAppointments,
    handleFiltersChange 
  } = useFilteredAppointments();
  
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { isLoading, updateAppointmentStatus } = useAppointmentActions(refreshAppointments);
  
  const handleOpenReminderDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReminderDialogOpen(true);
  };

  const getStatusCounts = () => {
    const counts = {
      scheduled: 0,
      checked_in: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0
    };

    allAppointments.forEach(apt => {
      if (counts.hasOwnProperty(apt.status)) {
        counts[apt.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{statusCounts.checked_in}</div>
                <div className="text-sm text-muted-foreground">Checked In</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statusCounts.in_progress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{statusCounts.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{statusCounts.no_show}</div>
                <div className="text-sm text-muted-foreground">No Show</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <AppointmentFilters onFiltersChange={handleFiltersChange} />

        {/* Main Appointments Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>
                  Appointments ({appointments.length})
                </CardTitle>
                {appointmentsLoading && (
                  <Badge variant="outline" className="animate-pulse">
                    Loading...
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={refreshAppointments} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No appointments found</p>
                <p className="text-sm mt-2">
                  {allAppointments.length > 0 
                    ? "Try adjusting your filters to see more results"
                    : "Create your first appointment to get started"
                  }
                </p>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        <SendReminderDialog
          open={reminderDialogOpen}
          onOpenChange={setReminderDialogOpen}
          appointment={selectedAppointment}
        />

        <CreateAppointmentDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    </TooltipProvider>
  );
};

export default EnhancedAppointmentTable;
