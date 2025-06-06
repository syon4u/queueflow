
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, Calendar, Users, Clock, PhoneCall, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AppointmentMetricsCards } from '../appointments/AppointmentMetricsCards';

export const PowerUserAppointmentsTab: React.FC = () => {
  const { appointments, customers, isLoading, refetch } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const handleScheduleAppointment = () => {
    toast({
      title: "Schedule Appointment",
      description: "New appointment scheduling form would open here",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'checked_in': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'scheduled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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
      {/* Header Section with Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointments Management</h2>
          <p className="text-gray-600">Monitor today's schedule and queue status</p>
        </div>
        
        {/* Quick Actions - Now in header */}
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "Check In", description: "Check in feature would open here" })}
          >
            <UserX className="h-4 w-4 mr-2" />
            Check In Customer
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "Queue View", description: "Full queue view would open here" })}
          >
            <Users className="h-4 w-4 mr-2" />
            View Queue
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "Walk-in", description: "Add walk-in form would open here" })}
          >
            <Clock className="h-4 w-4 mr-2" />
            Add Walk-in
          </Button>
          <Button 
            onClick={handleScheduleAppointment} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
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

      {/* Simplified Today's Schedule */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Schedule
            </CardTitle>
            <Badge variant="outline">
              {filteredAppointments.length} appointments
            </Badge>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search customers or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No matching appointments' : 'No appointments today'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Schedule your first appointment to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={handleScheduleAppointment} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {format(new Date(appointment.scheduled_time), 'h:mm a')}
                    </TableCell>
                    <TableCell>
                      {appointment.customer?.first_name} {appointment.customer?.last_name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.service?.name}</div>
                        <div className="text-sm text-gray-500">{appointment.service?.duration} min</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(appointment.status)} text-xs font-medium`}
                      >
                        {formatStatusText(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {appointment.status === 'scheduled' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleCheckIn(appointment.id)}
                            className="h-8 text-xs"
                          >
                            Check In
                          </Button>
                        )}
                        {appointment.status === 'checked_in' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStartService(appointment.id)}
                            className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                          >
                            Start Service
                          </Button>
                        )}
                        {appointment.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleCompleteService(appointment.id)}
                            className="h-8 text-xs bg-green-600 hover:bg-green-700"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
