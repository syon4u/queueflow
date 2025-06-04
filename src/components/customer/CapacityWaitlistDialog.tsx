
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Users } from 'lucide-react';
import { useCapacityManagement } from '@/hooks/use-capacity-management';

interface CapacityWaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWaitlist: () => void;
  locationName: string;
  serviceName: string;
  currentCapacity: number;
  maxCapacity: number;
  estimatedWaitTime?: number;
}

export const CapacityWaitlistDialog: React.FC<CapacityWaitlistDialogProps> = ({
  isOpen,
  onClose,
  onJoinWaitlist,
  locationName,
  serviceName,
  currentCapacity,
  maxCapacity,
  estimatedWaitTime = 30
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Location at Capacity
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>{locationName}</strong> is currently at full capacity for <strong>{serviceName}</strong>.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Capacity:</span>
              <span className="font-medium">{currentCapacity}/{maxCapacity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Wait Time:</span>
              <span className="font-medium">{estimatedWaitTime} minutes</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Join the Waitlist</div>
                <div className="text-sm text-gray-600">
                  We'll notify you via SMS when capacity becomes available. Your spot will be held for 15 minutes.
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onJoinWaitlist} className="flex-1">
            Join Waitlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
