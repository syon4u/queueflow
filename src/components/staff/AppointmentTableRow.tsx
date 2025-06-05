import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause,
  MessageSquare,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useCustomerSurvey } from '@/hooks/use-customer-survey';
import { CustomerSurveyModal } from '@/components/customer/CustomerSurveyModal';

interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  location_id: string;
  staff_id: string | null;
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  status: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes: string | null;
  reason_for_visit: string | null;
  created_at: string;
  updated_at: string;
  customers: {
    first_name: string;
    last_name: string;
  } | null;
  services: {
    name: string;
    duration: number;
  } | null;
}

interface AppointmentTableRowProps {
  appointment: Appointment;
  onAction?: (action: string, appointmentId: string) => void;
}

export const AppointmentTableRow = ({ appointment, onAction }: AppointmentTableRowProps) => {
  const { 
    openSurveyModal, 
    closeSurveyModal, 
    isModalOpen, 
    selectedAppointment,
    hasSurveyBeenSubmitted 
  } = useCustomerSurvey();

  const timeAgo = appointment.check_in_time
    ? formatDistanceToNow(new Date(appointment.check_in_time), { addSuffix: true })
    : 'Not checked in';

  const handleCheckIn = () => {
    onAction?.('check_in', appointment.id);
  };

  const handleStart = () => {
    onAction?.('start', appointment.id);
  };

  const handlePause = () => {
    onAction?.('pause', appointment.id);
  };

  const handleComplete = () => {
    onAction?.('complete', appointment.id);
  };

  const handleCancel = () => {
    onAction?.('cancel', appointment.id);
  };

  const handleSurveyRequest = () => {
    openSurveyModal(appointment.id, appointment.customer_id);
  };

  const showSurveyButton = appointment.status === 'completed' && 
    !hasSurveyBeenSubmitted(appointment.id);

  const showSurveyIndicator = appointment.status === 'completed' && 
    hasSurveyBeenSubmitted(appointment.id);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{appointment.customers?.first_name} {appointment.customers?.last_name}</div>
          <div className="text-sm text-gray-500">{appointment.services?.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{new Date(appointment.scheduled_time).toLocaleTimeString()}</div>
          <div className="text-sm text-gray-500">Duration: {appointment.services?.duration} min</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {appointment.status === 'scheduled' && (
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Scheduled
            </Badge>
          )}
          {appointment.status === 'checked_in' && (
            <Badge variant="secondary">
              <User className="h-3 w-3 mr-1" />
              Checked In {timeAgo}
            </Badge>
          )}
          {appointment.status === 'in_progress' && (
            <Badge variant="default">
              <Play className="h-3 w-3 mr-1" />
              In Progress
            </Badge>
          )}
          {appointment.status === 'completed' && (
            <Badge variant="success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
          {appointment.status === 'cancelled' && (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Cancelled
            </Badge>
          )}
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            {appointment.status === 'scheduled' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckIn}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <User className="h-4 w-4 mr-1" />
                Check In
              </Button>
            )}
            {appointment.status === 'checked_in' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStart}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
             {appointment.status === 'in_progress' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePause}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            )}
            {appointment.status === 'in_progress' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleComplete}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
            
            {showSurveyButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSurveyRequest}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Survey
              </Button>
            )}
            
            {showSurveyIndicator && (
              <Badge variant="secondary" className="text-green-600 bg-green-100">
                <Star className="h-3 w-3 mr-1" />
                Surveyed
              </Badge>
            )}
          </div>
        </td>
      </tr>

      {selectedAppointment && isModalOpen && (
        <CustomerSurveyModal
          isOpen={isModalOpen}
          onClose={closeSurveyModal}
          appointmentId={selectedAppointment.appointmentId}
          customerId={selectedAppointment.customerId}
          onSubmitSuccess={() => {
            // Refresh appointment data or show success message
            onAction?.('survey_completed', appointment.id);
          }}
        />
      )}
    </>
  );
};
