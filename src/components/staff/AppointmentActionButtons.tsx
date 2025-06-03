
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, History, MessageSquare, StickyNote, MoreHorizontal, CheckCircle, Play, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CustomerHistoryModal from './CustomerHistoryModal';
import { CommunicationDialog } from './CommunicationDialog';
import { CustomerNotesDialog } from './CustomerNotesDialog';
import type { Appointment } from '@/hooks/use-appointments';

interface AppointmentActionButtonsProps {
  appointment: Appointment;
  isLoading: boolean;
  onUpdateStatus: (id: string, status: any) => Promise<void>;
  onOpenReminderDialog: (appointment: Appointment) => void;
}

export const AppointmentActionButtons: React.FC<AppointmentActionButtonsProps> = ({
  appointment,
  isLoading,
  onUpdateStatus,
  onOpenReminderDialog
}) => {
  const { t } = useTranslation();
  const [communicationOpen, setCommunicationOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const getQuickActions = () => {
    switch (appointment.status) {
      case 'scheduled':
        return [
          {
            label: 'Check In',
            action: () => onUpdateStatus(appointment.id, 'checked_in'),
            icon: CheckCircle,
            variant: 'default' as const,
            disabled: false
          }
        ];
      case 'checked_in':
        return [
          {
            label: 'Start Service',
            action: () => onUpdateStatus(appointment.id, 'in_progress'),
            icon: Play,
            variant: 'default' as const,
            disabled: false
          }
        ];
      case 'in_progress':
        return [
          {
            label: 'Complete',
            action: () => onUpdateStatus(appointment.id, 'completed'),
            icon: CheckCircle,
            variant: 'default' as const,
            disabled: false
          }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="flex items-center gap-2">
      {/* Quick Action Button */}
      {quickActions.length > 0 && (
        <Button
          size="sm"
          variant={quickActions[0].variant}
          onClick={quickActions[0].action}
          disabled={isLoading || quickActions[0].disabled}
          className="whitespace-nowrap"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <quickActions[0].icon className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Loading...' : quickActions[0].label}
        </Button>
      )}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
          {/* Status Actions */}
          {appointment.status === 'scheduled' && (
            <>
              <DropdownMenuItem 
                onClick={() => onUpdateStatus(appointment.id, 'checked_in')}
                disabled={isLoading}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                Check In
              </DropdownMenuItem>
            </>
          )}
          
          {appointment.status === 'checked_in' && (
            <DropdownMenuItem 
              onClick={() => onUpdateStatus(appointment.id, 'in_progress')}
              disabled={isLoading}
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <Play className="h-4 w-4 text-blue-600" />
              Start Service
            </DropdownMenuItem>
          )}
          
          {appointment.status === 'in_progress' && (
            <DropdownMenuItem 
              onClick={() => onUpdateStatus(appointment.id, 'completed')}
              disabled={isLoading}
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              Complete
            </DropdownMenuItem>
          )}

          {['scheduled', 'checked_in'].includes(appointment.status) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                disabled={isLoading}
                className="flex items-center gap-2 hover:bg-red-50 text-red-600"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          
          {/* Communication Actions */}
          <DropdownMenuItem 
            onClick={() => onOpenReminderDialog(appointment)}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <Bell className="h-4 w-4 text-blue-600" />
            Send Reminder
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setCommunicationOpen(true)}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <MessageSquare className="h-4 w-4 text-green-600" />
            Send Message
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setNotesOpen(true)}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <StickyNote className="h-4 w-4 text-amber-600" />
            Manage Notes
          </DropdownMenuItem>

          <CustomerHistoryModal 
            customerId={appointment.customer_id}
            trigger={
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-50">
                <History className="h-4 w-4 text-purple-600" />
                View History
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <CommunicationDialog
        open={communicationOpen}
        onOpenChange={setCommunicationOpen}
        appointment={appointment}
      />

      <CustomerNotesDialog
        open={notesOpen}
        onOpenChange={setNotesOpen}
        customerId={appointment.customer_id}
      />
    </div>
  );
};
