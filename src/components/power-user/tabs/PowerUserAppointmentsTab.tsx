
import React, { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { AppointmentMetricsCards } from '../appointments/AppointmentMetricsCards';
import { AppointmentsList } from '../appointments/AppointmentsList';
import { QuickActions } from '../appointments/QuickActions';
import { AppointmentHeader } from '../appointments/AppointmentHeader';
import { AppointmentLoadingSkeleton } from '../appointments/AppointmentLoadingSkeleton';
import { useAppointmentHandlers } from '../appointments/AppointmentHandlers';
import { useAppointmentFilters } from '../appointments/AppointmentFilters';

export const PowerUserAppointmentsTab: React.FC = () => {
  const { appointments, isLoading, refetch } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const {
    todaysAppointments,
    filteredAppointments,
    queueStats,
    avgServiceTime
  } = useAppointmentFilters(appointments, searchTerm, statusFilter);

  const {
    handleCheckIn,
    handleStartService,
    handleCompleteService,
    handleAddWalkIn,
    handleScheduleFollowUp,
    handleViewFullQueue,
    handleScheduleAppointment
  } = useAppointmentHandlers(refetch);

  if (isLoading) {
    return <AppointmentLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <AppointmentHeader onScheduleAppointment={handleScheduleAppointment} />

      <AppointmentMetricsCards
        todaysCount={todaysAppointments.length}
        queueWaiting={queueStats.waiting}
        completed={queueStats.completed}
        avgServiceTime={avgServiceTime}
      />

      <QuickActions
        onViewFullQueue={handleViewFullQueue}
        onAddWalkIn={handleAddWalkIn}
        onScheduleFollowUp={handleScheduleFollowUp}
      />

      <AppointmentsList
        appointments={filteredAppointments}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        selectedAppointment={selectedAppointment}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onAppointmentSelect={setSelectedAppointment}
        onCheckIn={handleCheckIn}
        onStartService={handleStartService}
        onCompleteService={handleCompleteService}
        onScheduleAppointment={handleScheduleAppointment}
      />
    </div>
  );
};
