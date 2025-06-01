
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AppointmentActionButtons } from './AppointmentActionButtons';
import type { Appointment } from '@/hooks/use-appointments';

interface AppointmentTableRowProps {
  appointment: Appointment;
  isLoading: boolean;
  onUpdateStatus: (id: string, status: any) => Promise<void>;
  onOpenReminderDialog: (appointment: Appointment) => void;
}

// Helper function to determine badge variant based on status
const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'checked_in': return 'secondary';
    case 'in_progress': return 'default';
    case 'completed': return 'outline';
    case 'cancelled': 
    case 'no_show': 
      return 'destructive';
    default: return 'outline';
  }
};

export const AppointmentTableRow: React.FC<AppointmentTableRowProps> = ({
  appointment,
  isLoading,
  onUpdateStatus,
  onOpenReminderDialog
}) => {
  const { t } = useTranslation();

  return (
    <TableRow>
      <TableCell>
        {format(new Date(appointment.scheduled_time), 'PPp')}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(appointment.status)}>
          {t(`appointments.status.${appointment.status}`)}
        </Badge>
      </TableCell>
      <TableCell>
        {appointment.service_id}
        {appointment.reason_for_visit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                <Info size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="max-w-xs break-words">
                <span className="font-bold">{t('appointments.reasonForVisit')}:</span> {appointment.reason_for_visit}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">{appointment.customer_id}</TableCell>
      <TableCell>
        <AppointmentActionButtons
          appointment={appointment}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          onOpenReminderDialog={onOpenReminderDialog}
        />
      </TableCell>
    </TableRow>
  );
};
