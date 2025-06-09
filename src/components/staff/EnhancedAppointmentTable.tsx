
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SendReminderDialog } from './SendReminderDialog';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { AppointmentFilters } from './AppointmentFilters';
import { AppointmentPageHeader } from './appointment-table/AppointmentPageHeader';
import { AppointmentStatusCards } from './appointment-table/AppointmentStatusCards';
import { AppointmentTableContent } from './appointment-table/AppointmentTableContent';
import { useAppointmentTableLogic } from './appointment-table/hooks/useAppointmentTableLogic';

const EnhancedAppointmentTable: React.FC = () => {
  const {
    appointments,
    isLoading,
    statusCounts,
    reminderDialogOpen,
    setReminderDialogOpen,
    createDialogOpen,
    setCreateDialogOpen,
    selectedAppointment,
    showFilters,
    setShowFilters,
    refetch,
    handleOpenReminderDialog,
    handleAction,
    handleFiltersChange
  } = useAppointmentTableLogic();

  return (
    <TooltipProvider>
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <AppointmentPageHeader
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRefresh={refetch}
          onCreateAppointment={() => setCreateDialogOpen(true)}
        />

        {/* Status Overview Cards */}
        <AppointmentStatusCards statusCounts={statusCounts} />

        {/* Filters Section */}
        {showFilters && (
          <div className="animate-fade-in">
            <AppointmentFilters onFiltersChange={handleFiltersChange} />
          </div>
        )}

        {/* Main Appointments Table */}
        <AppointmentTableContent
          appointments={appointments}
          isLoading={isLoading}
          onAction={handleAction}
          onCreateAppointment={() => setCreateDialogOpen(true)}
        />

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
