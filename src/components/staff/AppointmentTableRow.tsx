
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Info, Clock, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AppointmentActionButtons } from './AppointmentActionButtons';
import type { Appointment } from '@/hooks/use-appointments';

interface AppointmentTableRowProps {
  appointment: Appointment;
  isLoading: boolean;
  onUpdateStatus: (id: string, status: any) => Promise<void>;
  onOpenReminderDialog: (appointment: Appointment) => void;
}

// Helper function to determine badge variant and styling based on status
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'scheduled': 
      return { 
        variant: 'outline' as const, 
        className: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
        icon: Clock
      };
    case 'checked_in': 
      return { 
        variant: 'secondary' as const, 
        className: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
        icon: User
      };
    case 'in_progress': 
      return { 
        variant: 'default' as const, 
        className: 'bg-green-50 text-green-700 border-green-200 font-medium',
        icon: Clock
      };
    case 'completed': 
      return { 
        variant: 'outline' as const, 
        className: 'bg-gray-50 text-gray-700 border-gray-200 font-medium',
        icon: Clock
      };
    case 'cancelled': 
    case 'no_show': 
      return { 
        variant: 'destructive' as const, 
        className: 'bg-red-50 text-red-700 border-red-200 font-medium',
        icon: Clock
      };
    default: 
      return { 
        variant: 'outline' as const, 
        className: 'bg-gray-50 text-gray-700 border-gray-200 font-medium',
        icon: Clock
      };
  }
};

export const AppointmentTableRow: React.FC<AppointmentTableRowProps> = ({
  appointment,
  isLoading,
  onUpdateStatus,
  onOpenReminderDialog
}) => {
  const { t } = useTranslation();

  // Get display names for better UX
  const customerName = appointment.customer 
    ? `${appointment.customer.first_name} ${appointment.customer.last_name}`
    : 'Unknown Customer';
  
  const serviceName = appointment.service?.name || 'Unknown Service';
  const statusConfig = getStatusConfig(appointment.status);

  return (
    <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      <TableCell className="py-4 px-6">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {format(new Date(appointment.scheduled_time), 'MMM dd, yyyy')}
          </div>
          <div className="text-sm text-gray-500">
            {format(new Date(appointment.scheduled_time), 'h:mm a')}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6">
        <Badge className={statusConfig.className}>
          <statusConfig.icon className="w-3 h-3 mr-1" />
          {t(`appointments.status.${appointment.status}`)}
        </Badge>
      </TableCell>
      
      <TableCell className="py-4 px-6">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{serviceName}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {appointment.service?.duration && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                {appointment.service.duration}m duration
              </span>
            )}
            {appointment.reason_for_visit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200">
                    <Info size={12} className="text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-xs">{t('appointments.reasonForVisit')}:</p>
                    <p className="text-xs break-words">{appointment.reason_for_visit}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="hidden md:table-cell py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{customerName}</div>
            {appointment.customer?.phone && (
              <div className="text-sm text-gray-500">{appointment.customer.phone}</div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6">
        <div className="flex justify-center">
          <AppointmentActionButtons
            appointment={appointment}
            isLoading={isLoading}
            onUpdateStatus={onUpdateStatus}
            onOpenReminderDialog={onOpenReminderDialog}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
