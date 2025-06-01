
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerNotesManager } from './customer-notes/CustomerNotesManager';
import { User, FileText, Calendar } from 'lucide-react';

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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer History - {customerName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="notes" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Communications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="flex-1 overflow-auto">
            <CustomerNotesManager
              customerId={customerId}
              customerName={customerName}
            />
          </TabsContent>
          
          <TabsContent value="appointments" className="flex-1 overflow-auto">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Appointment history will be displayed here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="communications" className="flex-1 overflow-auto">
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Communication history will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
