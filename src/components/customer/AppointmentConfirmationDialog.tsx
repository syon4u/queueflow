
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface AppointmentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmationCode: string;
}

const AppointmentConfirmationDialog = ({ 
  open, 
  onOpenChange, 
  confirmationCode 
}: AppointmentConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">Appointment Confirmed!</DialogTitle>
          <DialogDescription className="text-center">
            Your appointment has been successfully scheduled. Please save your confirmation code.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div className="text-center mb-4">
            <div className="text-sm text-muted-foreground">Confirmation Code</div>
            <div className="text-2xl font-bold mt-1">{confirmationCode}</div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground max-w-xs mx-auto">
            <p>Keep this code for check-in and status updates. Use it to check your queue position.</p>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:justify-center sm:space-x-2">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentConfirmationDialog;
