
import { useState, useEffect, useMemo } from 'react';
import { useRealtimeAppointments } from './use-realtime-appointments';
import { AppointmentFilterOptions } from '@/components/staff/AppointmentFilters';
import { Appointment } from './use-appointments';

export const useFilteredAppointments = () => {
  const { appointments, isLoading, error, refreshAppointments } = useRealtimeAppointments();
  const [filters, setFilters] = useState<AppointmentFilterOptions>({});

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
        const customerName = apt.customer 
          ? `${apt.customer.first_name} ${apt.customer.last_name}`.toLowerCase()
          : '';
        return customerName.includes(searchTerm);
      });
    }

    // Filter by service
    if (filters.service) {
      const searchTerm = filters.service.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.service?.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by date range
    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.scheduled_time);
        return aptDate >= filters.dateRange!.from && aptDate <= filters.dateRange!.to;
      });
    }

    return filtered;
  }, [appointments, filters]);

  const handleFiltersChange = (newFilters: AppointmentFilterOptions) => {
    setFilters(newFilters);
  };

  return {
    appointments: filteredAppointments,
    allAppointments: appointments,
    isLoading,
    error,
    refreshAppointments,
    filters,
    handleFiltersChange
  };
};
