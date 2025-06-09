
import React, { useState, useMemo } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { useAppointmentActions } from '@/hooks/use-appointment-actions';
import type { Appointment } from '@/hooks/use-appointments';

export const useAppointmentTableLogic = () => {
  const { appointments, isLoading, refetch } = useAppData();
  const { isLoading: actionsLoading, updateAppointmentStatus } = useAppointmentActions(refetch);
  
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});

  // Apply filters to appointments
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    // Filter by customer name
    if (filters.customerName) {
      const searchTerm = filters.customerName.toLowerCase();
      filtered = filtered.filter(apt => {
        const customerName = apt.customer ? `${apt.customer.first_name} ${apt.customer.last_name}`.toLowerCase() : '';
        return customerName.includes(searchTerm);
      });
    }

    // Filter by service
    if (filters.service) {
      const searchTerm = filters.service.toLowerCase();
      filtered = filtered.filter(apt => apt.service?.name?.toLowerCase().includes(searchTerm));
    }

    return filtered;
  }, [appointments, filters]);

  const getStatusCounts = () => {
    const counts = {
      scheduled: 0,
      checked_in: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0
    };

    appointments.forEach(apt => {
      if (counts.hasOwnProperty(apt.status)) {
        counts[apt.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const handleOpenReminderDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReminderDialogOpen(true);
  };

  const handleAction = (action: string, appointmentId: string) => {
    if (action === 'survey_completed') {
      refetch();
      return;
    }
    
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

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return {
    // Data
    appointments: filteredAppointments,
    isLoading,
    statusCounts: getStatusCounts(),
    
    // Dialog states
    reminderDialogOpen,
    setReminderDialogOpen,
    createDialogOpen,
    setCreateDialogOpen,
    selectedAppointment,
    
    // Filter states
    showFilters,
    setShowFilters,
    filters,
    
    // Actions
    refetch,
    handleOpenReminderDialog,
    handleAction,
    handleFiltersChange
  };
};
