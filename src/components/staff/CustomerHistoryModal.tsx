
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppData } from '@/hooks/useAppData';

interface CustomerHistoryProps {
  trigger: React.ReactNode;
  customerId?: string;
}

const CustomerHistoryModal: React.FC<CustomerHistoryProps> = ({ trigger, customerId }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { appointments, isLoading } = useAppData();
  const [open, setOpen] = useState(false);
  
  // Filter appointments for the specific customer
  const customerHistory = useMemo(() => {
    if (!customerId) return [];
    
    return appointments
      .filter(appointment => appointment.customer_id === customerId)
      .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
  }, [appointments, customerId]);
  
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {t('customer.history')}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-4">
            {t('customer.historyDescription')}
          </p>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : customerHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('customer.noAppointmentHistory')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('appointments.date')}</TableHead>
                  <TableHead>{t('appointments.service')}</TableHead>
                  <TableHead>{t('appointments.status')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('appointments.reasonForVisit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerHistory.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {format(new Date(appointment.scheduled_time), 'PPp')}
                    </TableCell>
                    <TableCell>
                      {appointment.service?.name || 'Unknown Service'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {t(`appointments.status.${appointment.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {appointment.reason_for_visit || t('common.notAvailable')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerHistoryModal;
