import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AppointmentMetricsCards } from '../appointments/AppointmentMetricsCards';
import { AppointmentsList } from '../appointments/AppointmentsList';
import { QuickActions } from '../appointments/QuickActions';

export const PowerUserAppointmentsTab: React.FC = () => {
  const { appointments, customers, isLoading, refetch } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  // Filter for today's appointments
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(apt => 
    new Date(apt.scheduled_time).toDateString() === today
  );

  // Apply filters
  const filteredAppointments = todaysAppointments.filter(apt => {
    const matchesSearch = searchTerm === '' || 
      apt.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate queue status
  const queueStats = {
    waiting: appointments.filter(apt => apt.status === 'checked_in').length,
    inProgress: appointments.filter(apt => apt.status === 'in_progress').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
  };

  // Calculate performance metrics
  const completedToday = todaysAppointments.filter(apt => apt.status === 'completed');
  const avgServiceTime = completedToday.length > 0 
    ? Math.round(completedToday.reduce((acc, apt) => {
        if (apt.start_time && apt.end_time) {
          const duration = new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime();
          return acc + (duration / 60000); // Convert to minutes
        }
        return acc;
      }, 0) / completedToday.length)
    : 0;

  const handleCheckIn = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer checked in successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in customer",
        variant: "destructive",
      });
    }
  };

  const handleStartService = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'in_progress',
          start_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service started successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start service",
        variant: "destructive",
      });
    }
  };

  const handleCompleteService = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service completed successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete service",
        variant: "destructive",
      });
    }
  };

  const handleAddWalkIn = () => {
    toast({
      title: "Walk-in Feature",
      description: "Walk-in appointment form would open here",
    });
  };

  const handleScheduleFollowUp = () => {
    toast({
      title: "Follow-up Feature",
      description: "Follow-up scheduling form would open here",
    });
  };

  const handleViewFullQueue = () => {
    toast({
      title: "Queue View",
      description: "Full queue management view would open here",
    });
  };

  const handleScheduleAppointment = () => {
    toast({
      title: "Schedule Appointment",
      description: "New appointment scheduling form would open here",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointments Management</h2>
          <p className="text-gray-600">Monitor today's schedule and queue status</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleScheduleAppointment} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <AppointmentMetricsCards
        todaysCount={todaysAppointments.length}
        queueWaiting={queueStats.waiting}
        completed={queueStats.completed}
        avgServiceTime={avgServiceTime}
      />

      {/* Quick Actions - Horizontal Layout */}
      <QuickActions
        onViewFullQueue={handleViewFullQueue}
        onAddWalkIn={handleAddWalkIn}
        onScheduleFollowUp={handleScheduleFollowUp}
      />

      {/* Today's Schedule - Full Width */}
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
