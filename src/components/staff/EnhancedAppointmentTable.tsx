import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download, Calendar, Filter } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  const { isLoading, updateAppointmentStatus } = useAppointmentActions(refreshAppointments);
  
  const handleOpenReminderDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReminderDialogOpen(true);
  };

  const handleAction = (action: string, appointmentId: string) => {
    if (action === 'survey_completed') {
      // Handle survey completion - refresh data
      refreshAppointments();
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
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
              <p className="text-gray-600">
                Manage and track all appointments across your locations
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setShowFilters(!showFilters)} 
                variant="outline" 
                size="sm"
                className="bg-white"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button onClick={refreshAppointments} variant="outline" size="sm" className="bg-white">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Scheduled', count: statusCounts.scheduled, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
            { label: 'Checked In', count: statusCounts.checked_in, color: 'amber', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
            { label: 'In Progress', count: statusCounts.in_progress, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
            { label: 'Completed', count: statusCounts.completed, color: 'gray', bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200' },
            { label: 'Cancelled', count: statusCounts.cancelled, color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
            { label: 'No Show', count: statusCounts.no_show, color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
          ].map((status) => (
            <Card key={status.label} className={`${status.bgColor} ${status.borderColor} border-2 hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${status.textColor} mb-1`}>{status.count}</div>
                  <div className="text-sm font-medium text-gray-600">{status.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="animate-fade-in">
            <AppointmentFilters onFiltersChange={handleFiltersChange} />
          </div>
        )}

        {/* Main Appointments Table */}
        <Card className="shadow-sm border-0 bg-white rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Appointments ({appointments.length})
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {allAppointments.length > appointments.length 
                      ? `Showing ${appointments.length} of ${allAppointments.length} total appointments`
                      : 'All appointments displayed'
                    }
                  </p>
                </div>
                {appointmentsLoading && (
                  <Badge variant="outline" className="animate-pulse bg-blue-50 text-blue-600 border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      Loading...
                    </div>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {appointmentsLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                </div>
                <p className="text-gray-500 mt-4 font-medium">Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center p-12 bg-gray-50">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-500 mb-6">
                    {allAppointments.length > 0 
                      ? "Try adjusting your filters to see more results"
                      : "Create your first appointment to get started"
                    }
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Appointment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <Table>
                  <AppointmentTableHeader />
                  <TableBody>
                    {appointments.map((appointment, index) => (
                      <AppointmentTableRow
                        key={appointment.id}
                        appointment={appointment}
                        onAction={handleAction}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
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
