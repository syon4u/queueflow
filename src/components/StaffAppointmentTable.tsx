
import React from 'react';
import { format } from 'date-fns';
import { PhoneCall, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Appointment, AppointmentStatus } from '@/hooks/use-appointments';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StaffAppointmentTableProps {
  appointments: Appointment[];
  onStatusChange: () => void;
}

const StaffAppointmentTable: React.FC<StaffAppointmentTableProps> = ({
  appointments,
  onStatusChange,
}) => {
  const { toast } = useToast();

  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'checked_in':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const updateData: Record<string, any> = { status };
      
      // Set appropriate timestamps based on status
      if (status === 'in_progress') {
        updateData.start_time = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.end_time = new Date().toISOString();
      }
      
      const { error } = await supabase.functions.invoke('appointments', {
        method: 'PATCH',
        body: updateData,
        path: `/${id}`,
      });

      if (error) throw error;
      
      toast({
        title: 'Appointment updated',
        description: `Status changed to ${status}`,
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update appointment status',
        variant: 'destructive',
      });
    }
  };

  const getWaitTime = (appointment: Appointment) => {
    if (!appointment.check_in_time) return 'Not checked in';
    
    const checkInTime = new Date(appointment.check_in_time);
    const now = new Date();
    const waitTimeInMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / (1000 * 60));
    
    return `${waitTimeInMinutes} min`;
  };

  return (
    <Table>
      <TableCaption>Active appointments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Wait Time</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No appointments found
            </TableCell>
          </TableRow>
        ) : (
          appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">{appointment.id.slice(0, 8)}</TableCell>
              <TableCell>{appointment.customer_id.slice(0, 8)}</TableCell>
              <TableCell>{appointment.service_id.slice(0, 8)}</TableCell>
              <TableCell>{getWaitTime(appointment)}</TableCell>
              <TableCell>{formatTime(appointment.scheduled_time)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(appointment.status)}`}>
                  {appointment.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {appointment.status === 'scheduled' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAppointmentStatus(appointment.id, 'checked_in')}
                    >
                      <PhoneCall className="mr-1 h-4 w-4" /> Call
                    </Button>
                  )}
                  
                  {appointment.status === 'checked_in' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                    >
                      <Check className="mr-1 h-4 w-4" /> Serve
                    </Button>
                  )}
                  
                  {appointment.status === 'in_progress' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                    >
                      <Check className="mr-1 h-4 w-4" /> Complete
                    </Button>
                  )}
                  
                  {(appointment.status === 'scheduled' || appointment.status === 'checked_in') && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                    >
                      <X className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default StaffAppointmentTable;
