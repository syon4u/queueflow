
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface NotificationPreferences {
  push: boolean;
  sms: boolean;
  email: boolean;
  positionUpdates: boolean;
  statusChanges: boolean;
  reminderBeforeCall: boolean;
}

interface MobileQueueNotificationsProps {
  onPreferencesChange?: (preferences: NotificationPreferences) => void;
}

export const MobileQueueNotifications: React.FC<MobileQueueNotificationsProps> = ({
  onPreferencesChange
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push: true,
    sms: false,
    email: false,
    positionUpdates: true,
    statusChanges: true,
    reminderBeforeCall: true,
  });
  const [pushSupported, setPushSupported] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    // Check if push notifications are supported
    setPushSupported('Notification' in window && 'serviceWorker' in navigator);
  }, []);

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onPreferencesChange?.(newPreferences);
  };

  const requestPushPermission = async () => {
    if (!pushSupported) {
      toast({
        title: t('public.mobileQueue.notifications.notSupported'),
        description: t('public.mobileQueue.notifications.notSupportedDescription'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        handlePreferenceChange('push', true);
        toast({
          title: t('public.mobileQueue.notifications.enabled'),
          description: t('public.mobileQueue.notifications.enabledDescription'),
        });
      } else {
        toast({
          title: t('public.mobileQueue.notifications.denied'),
          description: t('public.mobileQueue.notifications.deniedDescription'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: t('common.error'),
        description: t('public.mobileQueue.notifications.enableFailed'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('public.mobileQueue.notifications.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Methods */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">{t('public.mobileQueue.notifications.methods')}</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-gray-600" />
                <Label htmlFor="push-notifications" className="text-sm">
                  {t('public.mobileQueue.notifications.push')}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                {!preferences.push && pushSupported && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestPushPermission}
                  >
                    {t('public.mobileQueue.notifications.enable')}
                  </Button>
                )}
                <Switch
                  id="push-notifications"
                  checked={preferences.push}
                  onCheckedChange={(checked) => handlePreferenceChange('push', checked)}
                  disabled={!pushSupported}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <Label htmlFor="sms-notifications" className="text-sm">
                  {t('public.mobileQueue.notifications.sms')}
                </Label>
              </div>
              <Switch
                id="sms-notifications"
                checked={preferences.sms}
                onCheckedChange={(checked) => handlePreferenceChange('sms', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-600" />
                <Label htmlFor="email-notifications" className="text-sm">
                  {t('public.mobileQueue.notifications.email')}
                </Label>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.email}
                onCheckedChange={(checked) => handlePreferenceChange('email', checked)}
              />
            </div>
          </div>

          {/* Notification Types */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-gray-900">{t('public.mobileQueue.notifications.types')}</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="position-updates" className="text-sm">
                {t('public.mobileQueue.notifications.positionChanges')}
              </Label>
              <Switch
                id="position-updates"
                checked={preferences.positionUpdates}
                onCheckedChange={(checked) => handlePreferenceChange('positionUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="status-changes" className="text-sm">
                {t('public.mobileQueue.notifications.beingCalled')}
              </Label>
              <Switch
                id="status-changes"
                checked={preferences.statusChanges}
                onCheckedChange={(checked) => handlePreferenceChange('statusChanges', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-before-call" className="text-sm">
                {t('public.mobileQueue.notifications.reminder')}
              </Label>
              <Switch
                id="reminder-before-call"
                checked={preferences.reminderBeforeCall}
                onCheckedChange={(checked) => handlePreferenceChange('reminderBeforeCall', checked)}
              />
            </div>
          </div>

          {!pushSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                {t('public.mobileQueue.notifications.unsupported')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
