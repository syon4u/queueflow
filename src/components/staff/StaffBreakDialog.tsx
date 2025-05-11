
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { BREAK_TYPES } from './performance/constants';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BreakTypeSelector from './break/BreakTypeSelector';
import HandoverStaffSelector from './break/HandoverStaffSelector';

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
}

interface StaffBreakDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBreakStatusChange: () => void;
}

const StaffBreakDialog: React.FC<StaffBreakDialogProps> = ({
  open,
  onOpenChange,
  onBreakStatusChange
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [breakType, setBreakType] = useState('short');
  const [customDuration, setCustomDuration] = useState(15);
  const [handoverStaffId, setHandoverStaffId] = useState('none');
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);

  // Get duration based on break type
  const getDuration = () => {
    if (breakType === 'custom') return customDuration;
    const selectedBreak = BREAK_TYPES.find(b => b.value === breakType);
    return selectedBreak?.duration || 15;
  };

  // Fetch available staff for handover
  useEffect(() => {
    if (open && user) {
      const fetchAvailableStaff = async () => {
        try {
          // Get location_id for current staff
          const { data: currentStaff, error: staffError } = await supabase
            .from('staff')
            .select('location_id')
            .eq('id', user.id)
            .single();

          if (staffError) throw staffError;
          
          // Get staff at the same location who are active
          const { data, error } = await supabase
            .from('staff')
            .select('id, first_name, last_name')
            .eq('location_id', currentStaff.location_id)
            .neq('id', user.id)
            .eq('status', 'active') as any;
          
          if (error) throw error;
          
          // Filter to ensure we have valid staff members
          const validStaff = (data || []).filter(
            (s: any) => s.id && s.first_name && s.last_name
          );
          
          setAvailableStaff(validStaff as StaffMember[]);
        } catch (error) {
          console.error('Error fetching available staff:', error);
        }
      };

      fetchAvailableStaff();
    }
  }, [open, user]);

  // Handle taking a break
  const handleTakeBreak = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const duration = getDuration();
      const returnTime = new Date();
      returnTime.setMinutes(returnTime.getMinutes() + duration);

      // Update staff status and set return time using raw query
      const { error: statusError } = await supabase
        .from('staff')
        .update({
          status: 'break',
          return_time: returnTime.toISOString(),
          handover_staff_id: handoverStaffId !== 'none' ? handoverStaffId : null
        } as any)
        .eq('id', user.id);

      if (statusError) throw statusError;

      // If handover selected, notify that staff
      if (handoverStaffId && handoverStaffId !== 'none') {
        // Insert notification for handover staff using raw query
        const { error: notifyError } = await supabase
          .from('staff_notifications')
          .insert({
            staff_id: handoverStaffId,
            type: 'handover',
            message: t('staff.handoverRequestMessage', { 
              name: user.user_metadata?.name || user.email,
              duration 
            }),
            status: 'unread'
          } as any);

        if (notifyError) throw notifyError;
      }

      toast({
        title: t('staff.breakStartedTitle'),
        description: t('staff.breakStartedDescription', { duration })
      });
      
      onOpenChange(false);
      onBreakStatusChange();
    } catch (error) {
      console.error('Error setting break status:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('staff.breakErrorDescription')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('staff.takeABreak')}</DialogTitle>
          <DialogDescription>{t('staff.breakDescription')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <BreakTypeSelector
            breakType={breakType}
            onBreakTypeChange={setBreakType}
            customDuration={customDuration}
            onCustomDurationChange={setCustomDuration}
          />
          
          <HandoverStaffSelector 
            handoverStaffId={handoverStaffId}
            onHandoverStaffChange={setHandoverStaffId}
            availableStaff={availableStaff}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleTakeBreak} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            {t('staff.startBreak', { duration: getDuration() })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffBreakDialog;
