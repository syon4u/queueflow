
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Phone, CheckCircle } from 'lucide-react';
import { VirtualQueueJoin } from '@/components/queue/VirtualQueueJoin';
import { VirtualQueueTicket } from '@/components/queue/VirtualQueueTicket';
import QueuePositionTracker from '@/components/customer/QueuePositionTracker';
import { checkInPublicAppointment } from '@/lib/publicQueue';
import { toast } from '@/components/ui/use-toast';

const VirtualQueuePage = () => {
  const { t } = useTranslation();
  const [hasJoinedQueue, setHasJoinedQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [ticketData, setTicketData] = useState<any>(null);

  const handleJoinQueue = (ticketInfo: any) => {
    setHasJoinedQueue(true);
    setQueuePosition(ticketInfo?.position ?? 0);
    setEstimatedWait(ticketInfo?.estimatedWait ?? 0);
    setTicketData(ticketInfo);
  };

  const handleLeaveQueue = () => {
    setHasJoinedQueue(false);
    setQueuePosition(0);
    setEstimatedWait(0);
    setTicketData(null);
  };

  const handleCheckIn = async () => {
    if (!ticketData?.id) return;
    try {
      const checkedIn = await checkInPublicAppointment(ticketData.id, ticketData.confirmationCode);
      setTicketData({ ...ticketData, status: checkedIn.status, position: checkedIn.position ?? ticketData.position });
      setQueuePosition(checkedIn.position ?? 0);
      setEstimatedWait(checkedIn.estimated_wait_minutes ?? 0);
      toast({
        title: t('public.virtualQueue.checkedInTitle'),
        description: checkedIn.position
          ? t('public.virtualQueue.checkedInWithPosition', { position: checkedIn.position, minutes: checkedIn.estimated_wait_minutes })
          : t('public.virtualQueue.checkedInNoPosition'),
      });
    } catch (error) {
      toast({
        title: t('public.virtualQueue.checkInFailed'),
        description: error instanceof Error ? error.message : t('public.virtualQueue.checkInFallback'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{t('public.virtualQueue.title')}</h1>
          <p className="text-gray-600">{t('public.virtualQueue.subtitle')}</p>
        </div>

        {!hasJoinedQueue ? (
          <VirtualQueueJoin onJoinSuccess={handleJoinQueue} />
        ) : (
          <div className="space-y-6">
            {ticketData && (
              <VirtualQueueTicket 
                ticketData={ticketData}
                onCheckIn={handleCheckIn}
              />
            )}
            <QueuePositionTracker 
              currentPosition={queuePosition}
              estimatedWaitTime={estimatedWait}
              onLeaveQueue={handleLeaveQueue}
            />
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('public.virtualQueue.features.sms.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                {t('public.virtualQueue.features.sms.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('public.virtualQueue.features.location.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                {t('public.virtualQueue.features.location.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('public.virtualQueue.features.tracking.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                {t('public.virtualQueue.features.tracking.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualQueuePage;
