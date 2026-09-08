
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  status: string;
  scheduled_time: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  service?: {
    name: string;
    duration: number;
  };
  start_time?: string;
  end_time?: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  searchTerm: string;
  statusFilter: string;
  selectedAppointment: string | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onAppointmentSelect: (id: string) => void;
  onCheckIn: (id: string) => void;
  onStartService: (id: string) => void;
  onCompleteService: (id: string) => void;
  onScheduleAppointment: () => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  searchTerm,
  statusFilter,
  selectedAppointment,
  onSearchChange,
  onStatusFilterChange,
  onAppointmentSelect,
  onCheckIn,
  onStartService,
  onCompleteService,
  onScheduleAppointment
}) => {
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

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            Today's Schedule
          </CardTitle>
          <Badge variant="outline">
            {appointments.length} appointments
          </Badge>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search customers or services..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
        {appointments.length === 0 ? (
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
              <Button onClick={onScheduleAppointment} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            )}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {appointments.map((appointment, index) => (
              <div 
                key={appointment.id} 
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === appointments.length - 1 ? 'border-b-0' : ''
                } ${selectedAppointment === appointment.id ? 'bg-blue-50 border-blue-200' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onAppointmentSelect(appointment.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onAppointmentSelect(appointment.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {appointment.customer?.first_name} {appointment.customer?.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">{appointment.service?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(appointment.scheduled_time), 'h:mm a')} • {appointment.service?.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(appointment.status)} text-xs font-medium`}
                    >
                      {formatStatusText(appointment.status)}
                    </Badge>
                    
                    {appointment.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onCheckIn(appointment.id);
                        }}
                        className="h-8 text-xs"
                      >
                        Check In
                      </Button>
                    )}
                    {appointment.status === 'checked_in' && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartService(appointment.id);
                        }}
                        className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        Start Service
                      </Button>
                    )}
                    {appointment.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompleteService(appointment.id);
                        }}
                        className="h-8 text-xs bg-green-600 hover:bg-green-700"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
