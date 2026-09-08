
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MobileQueueTracker } from '@/components/mobile/MobileQueueTracker';
import { MobileQueueNotifications } from '@/components/mobile/MobileQueueNotifications';
import { MobileQueueProgress } from '@/components/mobile/MobileQueueProgress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { findPublicAppointment } from '@/lib/publicQueue';

const MobileQueuePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('position');
  
  // Get appointment ID from URL params
  const appointmentId = searchParams.get('appointment');
  
  // Live position for the progress tab (the Position tab has its own tracker).
  const { data: appointment } = useQuery({
    queryKey: ['mobile-queue-appointment', appointmentId],
    queryFn: () => findPublicAppointment({ appointmentId: appointmentId! }),
    enabled: !!appointmentId,
    refetchInterval: 30000,
  });
  const progressData = {
    currentPosition: appointment?.position ?? 0,
    totalInQueue: appointment?.total_in_queue ?? 0,
    estimatedWaitTime: appointment?.estimated_wait_minutes ?? 0,
    averageServiceTime: appointment?.service_duration ?? 15,
  };

  useEffect(() => {
    if (!appointmentId) {
      toast({
        title: t('public.mobileQueue.noAppointmentTitle'),
        description: t('public.mobileQueue.noAppointmentToast'),
        variant: 'destructive',
      });
      return;
    }
  }, [appointmentId, toast, t]);

  const handleNotificationToggle = (enabled: boolean) => {
    console.log('Notifications toggled:', enabled);
  };

  const handleNotificationPreferences = (preferences: any) => {
    console.log('Notification preferences updated:', preferences);
    toast({
      title: t('public.mobileQueue.preferencesUpdated'),
      description: t('public.mobileQueue.preferencesSaved'),
    });
  };

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-4">
                {t('public.mobileQueue.noAppointmentTitle')}
              </h2>
              <p className="text-red-600 mb-6">
                {t('public.mobileQueue.noAppointmentDescription')}
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('public.mobileQueue.goHome')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile Tab Navigation */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="position" className="text-xs">
                {t('public.mobileQueue.tabs.position')}
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-xs">
                {t('public.mobileQueue.tabs.progress')}
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="position" className="mt-0">
          <MobileQueueTracker
            appointmentId={appointmentId}
            onNotificationToggle={handleNotificationToggle}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-0">
          <div className="max-w-md mx-auto p-4">
            <MobileQueueProgress
              currentPosition={progressData.currentPosition}
              totalInQueue={progressData.totalInQueue}
              estimatedWaitTime={progressData.estimatedWaitTime}
              averageServiceTime={progressData.averageServiceTime}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <div className="max-w-md mx-auto p-4">
            <MobileQueueNotifications
              onPreferencesChange={handleNotificationPreferences}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileQueuePage;
