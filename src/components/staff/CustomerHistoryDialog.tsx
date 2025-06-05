
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerNotesManager } from './customer-notes/CustomerNotesManager';
import { CustomerCommunicationHistory } from './CustomerCommunicationHistory';
import { CustomerAppointmentHistory } from './CustomerAppointmentHistory';
import { User, FileText, Calendar, MessageSquare } from 'lucide-react';

interface CustomerHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
}

export const CustomerHistoryDialog: React.FC<CustomerHistoryDialogProps> = ({
  open,
  onOpenChange,
  customerId,
  customerName
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer History - {customerName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="notes" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Communications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="flex-1 overflow-auto mt-6">
            <CustomerNotesManager
              customerId={customerId}
              customerName={customerName}
            />
          </TabsContent>
          
          <TabsContent value="appointments" className="flex-1 overflow-auto mt-6">
            <CustomerAppointmentHistory
              customerId={customerId}
              customerName={customerName}
            />
          </TabsContent>
          
          <TabsContent value="communications" className="flex-1 overflow-auto mt-6">
            <CustomerCommunicationHistory
              customerId={customerId}
              customerName={customerName}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
