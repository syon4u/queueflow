
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Settings, UserPlus, RotateCcw, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const EnhancedQueueControls: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [priorityReason, setPriorityReason] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [estimatedWait, setEstimatedWait] = useState(15);

  const addPriorityCustomer = async () => {
    if (!priorityReason.trim()) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.priorityReasonRequired'),
      });
      return;
    }

    try {
      // Implementation would add priority customer to queue
      toast({
        title: t('queue.priorityCustomerAdded'),
        description: priorityReason,
      });
      setPriorityReason('');
    } catch (error) {
      console.error('Error adding priority customer:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.addPriorityError'),
      });
    }
  };

  const resetQueue = async () => {
    try {
      // Implementation would reset the queue
      toast({
        title: t('queue.queueReset'),
        description: t('queue.queueResetDescription'),
      });
    } catch (error) {
      console.error('Error resetting queue:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('queue.resetError'),
      });
    }
  };

  const updateWaitTime = async () => {
    try {
      // Implementation would update estimated wait times
      toast({
        title: t('queue.waitTimeUpdated'),
        description: `${estimatedWait} ${t('common.minutes')}`,
      });
    } catch (error) {
      console.error('Error updating wait time:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t('queue.addPriorityCustomer')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service">{t('queue.service')}</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder={t('queue.selectService')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document-review">{t('services.documentReview')}</SelectItem>
                <SelectItem value="application">{t('services.application')}</SelectItem>
                <SelectItem value="consultation">{t('services.consultation')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority-reason">{t('queue.priorityReason')}</Label>
            <Input
              id="priority-reason"
              value={priorityReason}
              onChange={(e) => setPriorityReason(e.target.value)}
              placeholder={t('queue.priorityReasonPlaceholder')}
            />
          </div>
          
          <Button 
            onClick={addPriorityCustomer}
            disabled={!priorityReason.trim() || !selectedService}
            className="w-full"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {t('queue.addToPriority')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('queue.queueSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estimated-wait">{t('queue.estimatedWaitTime')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="estimated-wait"
                type="number"
                value={estimatedWait}
                onChange={(e) => setEstimatedWait(Number(e.target.value))}
                min="1"
                max="180"
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">{t('common.minutes')}</span>
              <Button size="sm" variant="outline" onClick={updateWaitTime}>
                {t('common.update')}
              </Button>
            </div>
          </div>

          <Button 
            variant="destructive" 
            onClick={resetQueue}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('queue.resetQueue')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
