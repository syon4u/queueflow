
import React, { useState } from 'react';
import { VirtualQueueJoin } from '@/components/queue/VirtualQueueJoin';
import { VirtualQueueTicket } from '@/components/queue/VirtualQueueTicket';
import { QRCodeScanner } from '@/components/queue/QRCodeScanner';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Smartphone, QrCode, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const VirtualQueuePage: React.FC = () => {
  const [ticketData, setTicketData] = useState<any>(null);
  const [showPWAPrompt, setShowPWAPrompt] = useState(true);
  const [activeTab, setActiveTab] = useState('join');
  const { toast } = useToast();

  const handleJoinSuccess = (data: any) => {
    setTicketData(data);
    setActiveTab('ticket');
  };

  const handleCheckIn = async () => {
    if (!ticketData) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', ticketData.id);

      if (error) throw error;

      setTicketData(prev => ({ ...prev, status: 'checked_in' }));
      
      toast({
        title: 'Checked In Successfully',
        description: 'You\'re now in the physical queue. Please wait to be called.',
      });
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: 'Check-in Failed',
        description: 'Please try again or ask staff for assistance.',
        variant: 'destructive'
      });
    }
  };

  const handleQRScan = async (qrData: string) => {
    try {
      // Try to parse as JSON first (our QR format)
      let appointmentId;
      try {
        const parsed = JSON.parse(qrData);
        appointmentId = parsed.appointmentId;
      } catch {
        // Fallback: treat as appointment ID directly
        appointmentId = qrData;
      }

      // Check in the appointment
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: 'QR Check-in Successful',
        description: 'Welcome! Please wait to be called for service.',
      });

      setActiveTab('join');
    } catch (error) {
      console.error('QR scan error:', error);
      toast({
        title: 'Invalid QR Code',
        description: 'Please check your QR code or ask staff for assistance.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white shadow-lg border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900 flex items-center justify-center gap-2">
              <Smartphone className="h-6 w-6" />
              QueueFlow 2.0 Virtual Queue
            </CardTitle>
            <p className="text-blue-700">
              Join queues remotely, check in with QR codes, and get real-time updates
            </p>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="join" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Join Queue
            </TabsTrigger>
            <TabsTrigger value="ticket" disabled={!ticketData}>
              <Smartphone className="h-4 w-4" />
              My Ticket
            </TabsTrigger>
            <TabsTrigger value="scan">
              <QrCode className="h-4 w-4" />
              QR Check-in
            </TabsTrigger>
          </TabsList>

          <TabsContent value="join" className="mt-6">
            <VirtualQueueJoin onJoinSuccess={handleJoinSuccess} />
          </TabsContent>

          <TabsContent value="ticket" className="mt-6">
            {ticketData && (
              <VirtualQueueTicket 
                ticketData={ticketData} 
                onCheckIn={handleCheckIn}
              />
            )}
          </TabsContent>

          <TabsContent value="scan" className="mt-6">
            <QRCodeScanner 
              onScanSuccess={handleQRScan}
              onError={(error) => toast({
                title: 'Scanner Error',
                description: error,
                variant: 'destructive'
              })}
            />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <Card className="bg-white border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium text-blue-800">
                  <Users className="h-4 w-4" />
                  1. Join Remotely
                </div>
                <p className="text-gray-600">
                  Select your location and service, then join the virtual queue from anywhere
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium text-blue-800">
                  <Smartphone className="h-4 w-4" />
                  2. Get Updates
                </div>
                <p className="text-gray-600">
                  Receive real-time position updates and estimated wait times via SMS
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium text-blue-800">
                  <QrCode className="h-4 w-4" />
                  3. Check In
                </div>
                <p className="text-gray-600">
                  Scan your QR code or tap "I'm Here" when you arrive at the location
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PWA Install Prompt */}
      {showPWAPrompt && (
        <PWAInstallPrompt onDismiss={() => setShowPWAPrompt(false)} />
      )}
    </div>
  );
};
