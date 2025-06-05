
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, History, MessageSquare, StickyNote, MoreHorizontal, CheckCircle, Play, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CustomerHistoryModal from './CustomerHistoryModal';
import { CommunicationDialog } from './CommunicationDialog';
import { CustomerNotesDialog } from './CustomerNotesDialog';
import { toast } from '@/hooks/use-toast';
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: string, actionType: string) => {
    try {
      setActionLoading(actionType);
      await onUpdateStatus(appointment.id, newStatus);
      
      // Show success message
      const statusMessages = {
        'checked_in': 'Customer checked in successfully',
        'in_progress': 'Service started successfully',
        'completed': 'Appointment completed successfully',
        'cancelled': 'Appointment cancelled successfully'
      };
      
      toast({
        title: 'Status Updated',
        description: statusMessages[newStatus as keyof typeof statusMessages] || 'Status updated successfully',
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update appointment status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getQuickActions = () => {
    switch (appointment.status) {
      case 'scheduled':
        return [
          {
            label: 'Check In',
            action: () => handleStatusUpdate('checked_in', 'check_in'),
            icon: CheckCircle,
            variant: 'default' as const,
            disabled: false,
            actionType: 'check_in'
          }
        ];
      case 'checked_in':
        return [
          {
            label: 'Start Service',
            action: () => handleStatusUpdate('in_progress', 'start_service'),
            icon: Play,
            variant: 'default' as const,
            disabled: false,
            actionType: 'start_service'
          }
        ];
      case 'in_progress':
        return [
          {
            label: 'Complete',
            action: () => handleStatusUpdate('completed', 'complete'),
            icon: CheckCircle,
            variant: 'default' as const,
            disabled: false,
            actionType: 'complete'
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
          disabled={isLoading || quickActions[0].disabled || actionLoading === quickActions[0].actionType}
          className="whitespace-nowrap"
        >
          {actionLoading === quickActions[0].actionType ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            React.createElement(quickActions[0].icon, { className: "h-4 w-4 mr-2" })
          )}
          {actionLoading === quickActions[0].actionType ? 'Processing...' : quickActions[0].label}
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
                onClick={() => handleStatusUpdate('checked_in', 'check_in_dropdown')}
                disabled={isLoading || actionLoading === 'check_in_dropdown'}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                {actionLoading === 'check_in_dropdown' ? 'Processing...' : 'Check In'}
              </DropdownMenuItem>
            </>
          )}
          
          {appointment.status === 'checked_in' && (
            <DropdownMenuItem 
              onClick={() => handleStatusUpdate('in_progress', 'start_service_dropdown')}
              disabled={isLoading || actionLoading === 'start_service_dropdown'}
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <Play className="h-4 w-4 text-blue-600" />
              {actionLoading === 'start_service_dropdown' ? 'Processing...' : 'Start Service'}
            </DropdownMenuItem>
          )}
          
          {appointment.status === 'in_progress' && (
            <DropdownMenuItem 
              onClick={() => handleStatusUpdate('completed', 'complete_dropdown')}
              disabled={isLoading || actionLoading === 'complete_dropdown'}
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              {actionLoading === 'complete_dropdown' ? 'Processing...' : 'Complete'}
            </DropdownMenuItem>
          )}

          {['scheduled', 'checked_in'].includes(appointment.status) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate('cancelled', 'cancel')}
                disabled={isLoading || actionLoading === 'cancel'}
                className="flex items-center gap-2 hover:bg-red-50 text-red-600"
              >
                <XCircle className="h-4 w-4" />
                {actionLoading === 'cancel' ? 'Processing...' : 'Cancel'}
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
