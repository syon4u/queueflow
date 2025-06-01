
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DirectCommunication } from './DirectCommunication';
import { Customer } from '@/components/customer/CustomerSearchBox';

interface DirectCommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export const DirectCommunicationDialog: React.FC<DirectCommunicationDialogProps> = ({
  open,
  onOpenChange,
  customer
}) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Direct Communication</DialogTitle>
        </DialogHeader>
        <DirectCommunication 
          customer={customer} 
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
