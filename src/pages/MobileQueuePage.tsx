
import React, { useState, useEffect } from 'react';
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

const MobileQueuePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('position');
  
  // Get appointment ID from URL params
  const appointmentId = searchParams.get('appointment');
  
  // Mock data for progress component (in real app, this would come from API)
  const [progressData, setProgressData] = useState({
    currentPosition: 3,
    totalInQueue: 8,
    estimatedWaitTime: 25,
    averageServiceTime: 15
  });

  useEffect(() => {
    if (!appointmentId) {
      toast({
        title: 'No Appointment Found',
        description: 'Please scan your QR code or check your confirmation.',
        variant: 'destructive',
      });
      return;
    }
  }, [appointmentId, toast]);

  const handleNotificationToggle = (enabled: boolean) => {
    console.log('Notifications toggled:', enabled);
  };

  const handleNotificationPreferences = (preferences: any) => {
    console.log('Notification preferences updated:', preferences);
    toast({
      title: 'Preferences Updated',
      description: 'Your notification settings have been saved.',
    });
  };

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-4">
                No Appointment Found
              </h2>
              <p className="text-red-600 mb-6">
                Please scan your QR code or check your confirmation details.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
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
                Position
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-xs">
                Progress
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
