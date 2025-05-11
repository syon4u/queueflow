
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface BlackoutPeriodControlProps {
  locationId?: string;
}

const BlackoutPeriodControl: React.FC<BlackoutPeriodControlProps> = ({ locationId }) => {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [isBlackoutActive, setIsBlackoutActive] = useState(false);
  const [reason, setReason] = useState('');
  const [estimatedEndTime, setEstimatedEndTime] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if blackout is active on component mount
  useEffect(() => {
    if (locationId) {
      checkBlackoutStatus(locationId);
    }
  }, [locationId]);
  
  const checkBlackoutStatus = async (locationId: string) => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('blackout_active, blackout_reason, blackout_end_time')
        .eq('id', locationId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setIsBlackoutActive(data.blackout_active || false);
        setReason(data.blackout_reason || '');
        setEstimatedEndTime(data.blackout_end_time || '');
      }
    } catch (error) {
      console.error('Error checking blackout status:', error);
    }
  };
  
  const toggleBlackoutPeriod = async (active: boolean) => {
    if (!user || !locationId) return;
    if (role !== 'admin' && role !== 'staff') return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: any = {
        blackout_active: active
      };
      
      if (active) {
        updateData.blackout_reason = reason;
        updateData.blackout_start_time = new Date().toISOString();
        updateData.blackout_end_time = estimatedEndTime || null;
      } else {
        updateData.blackout_reason = null;
        updateData.blackout_end_time = null;
      }
      
      const { error } = await supabase
        .from('locations')
        .update(updateData)
        .eq('id', locationId);
      
      if (error) throw error;
      
      setIsBlackoutActive(active);
      toast({
        title: t('common.success'),
        description: active 
          ? t('staff.blackoutPeriod.enabled') 
          : t('staff.blackoutPeriod.disabled')
      });
      
      if (active) {
        setOpen(false);
      }
    } catch (error) {
      console.error('Error toggling blackout period:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update blackout period',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!locationId || (role !== 'admin' && role !== 'staff')) {
    return null;
  }
  
  return (
    <div className="mb-4">
      {isBlackoutActive ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('staff.blackoutPeriod.active')}</AlertTitle>
            <AlertDescription>
              {reason || t('staff.blackoutPeriod.description')}
              {estimatedEndTime && (
                <span className="block mt-1">
                  {t('staff.blackoutPeriod.estimatedEnd')}: {new Date(estimatedEndTime).toLocaleString()}
                </span>
              )}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            onClick={() => toggleBlackoutPeriod(false)}
            disabled={isSubmitting}
          >
            {t('staff.blackoutPeriod.disable')}
          </Button>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              {t('staff.blackoutPeriod.enable')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('staff.blackoutPeriod.enable')}</DialogTitle>
              <DialogDescription>
                {t('staff.blackoutPeriod.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">{t('staff.blackoutPeriod.reason')}</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('staff.blackoutPeriod.reasonPlaceholder')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimatedEndTime">
                  {t('staff.blackoutPeriod.estimatedEndTime')}
                </Label>
                <Input
                  id="estimatedEndTime"
                  type="datetime-local"
                  value={estimatedEndTime}
                  onChange={(e) => setEstimatedEndTime(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => toggleBlackoutPeriod(true)}
                disabled={isSubmitting}
              >
                {t('staff.blackoutPeriod.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BlackoutPeriodControl;
