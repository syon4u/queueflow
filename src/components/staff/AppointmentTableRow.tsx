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
        className: 'bg-blue-50 text-blue-700 border-blue-200 font-medium hover:bg-blue-100 transition-colors',
        icon: Clock
      };
    case 'checked_in': 
      return { 
        variant: 'secondary' as const, 
        className: 'bg-amber-50 text-amber-700 border-amber-200 font-medium hover:bg-amber-100 transition-colors',
        icon: User
      };
    case 'in_progress': 
      return { 
        variant: 'default' as const, 
        className: 'bg-green-50 text-green-700 border-green-200 font-medium hover:bg-green-100 transition-colors',
        icon: Clock
      };
    case 'completed': 
      return { 
        variant: 'outline' as const, 
        className: 'bg-gray-50 text-gray-700 border-gray-200 font-medium hover:bg-gray-100 transition-colors',
        icon: Clock
      };
    case 'cancelled': 
    case 'no_show': 
      return { 
        variant: 'destructive' as const, 
        className: 'bg-red-50 text-red-700 border-red-200 font-medium hover:bg-red-100 transition-colors',
        icon: Clock
      };
    default: 
      return { 
        variant: 'outline' as const, 
        className: 'bg-gray-50 text-gray-700 border-gray-200 font-medium hover:bg-gray-100 transition-colors',
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
    <TableRow className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 border-b border-gray-100 group cursor-pointer relative">
      {/* Subtle selection indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
      
      <TableCell className="py-4 px-6 relative">
        <div className="space-y-1">
          <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
            {format(new Date(appointment.scheduled_time), 'MMM dd, yyyy')}
          </div>
          <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
            {format(new Date(appointment.scheduled_time), 'h:mm a')}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6">
        <Badge className={`${statusConfig.className} cursor-pointer transform group-hover:scale-105 transition-transform duration-200`}>
          <statusConfig.icon className="w-3 h-3 mr-1" />
          {t(`appointments.statusOptions.${appointment.status}`)}
        </Badge>
      </TableCell>
      
      <TableCell className="py-4 px-6">
        <div className="space-y-1">
          <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{serviceName}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {appointment.service?.duration && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                {appointment.service.duration}m duration
              </span>
            )}
            {appointment.reason_for_visit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <Info size={12} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs bg-white border border-gray-200 shadow-lg">
                  <div className="space-y-1">
                    <p className="font-semibold text-xs text-gray-700">{t('appointments.reasonForVisit')}:</p>
                    <p className="text-xs break-words text-gray-600">{appointment.reason_for_visit}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="hidden md:table-cell py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
            <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
              {customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{customerName}</div>
            {appointment.customer?.phone && (
              <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">{appointment.customer.phone}</div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6">
        <div className="flex justify-center transform group-hover:scale-105 transition-transform duration-200">
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
