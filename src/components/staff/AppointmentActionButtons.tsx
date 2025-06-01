
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, History, Plus, MessageSquare, StickyNote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

  return (
    <div className="flex items-center space-x-1">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdateStatus(appointment.id, 'checked_in')}
        disabled={isLoading || appointment.status !== 'scheduled'}
        title={t('appointments.checkIn')}
      >
        {isLoading ? t('common.loading') : t('appointments.checkIn')}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdateStatus(appointment.id, 'in_progress')}
        disabled={isLoading || appointment.status !== 'checked_in'}
        title={t('appointments.startService')}
      >
        {isLoading ? t('common.loading') : t('appointments.startService')}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdateStatus(appointment.id, 'completed')}
        disabled={isLoading || appointment.status !== 'in_progress'}
        title={t('appointments.complete')}
      >
        {isLoading ? t('common.loading') : t('appointments.complete')}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
        disabled={isLoading || appointment.status === 'cancelled'}
        title={t('appointments.cancel')}
      >
        {isLoading ? t('common.loading') : t('appointments.cancel')}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onOpenReminderDialog(appointment)}
        title={t('appointments.sendReminder')}
      >
        <Bell className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setCommunicationOpen(true)}
        title={t('communication.sendMessage')}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setNotesOpen(true)}
        title={t('notes.manageNotes')}
      >
        <StickyNote className="h-4 w-4" />
      </Button>
      <CustomerHistoryModal 
        customerId={appointment.customer_id}
        trigger={
          <Button
            size="sm"
            variant="outline"
            title={t('customer.viewHistory')}
          >
            <History className="h-4 w-4" />
          </Button>
        }
      />

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
