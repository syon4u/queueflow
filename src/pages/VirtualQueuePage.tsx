
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Phone, CheckCircle } from 'lucide-react';
import { VirtualQueueJoin } from '@/components/queue/VirtualQueueJoin';
import { VirtualQueueTicket } from '@/components/queue/VirtualQueueTicket';
import QueuePositionTracker from '@/components/customer/QueuePositionTracker';

const VirtualQueuePage = () => {
  const [hasJoinedQueue, setHasJoinedQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [ticketData, setTicketData] = useState<any>(null);

  const handleJoinQueue = (ticketInfo: any) => {
    console.log('Joining queue with:', ticketInfo);
    setHasJoinedQueue(true);
    setQueuePosition(5);
    setEstimatedWait(25);
    setTicketData(ticketInfo);
  };

  const handleLeaveQueue = () => {
    setHasJoinedQueue(false);
    setQueuePosition(0);
    setEstimatedWait(0);
    setTicketData(null);
  };

  const handleCheckIn = () => {
    console.log('Checking in...');
    // Handle check-in logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Virtual Queue</h1>
          <p className="text-gray-600">Join the queue from anywhere and track your position in real-time</p>
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
              <CardTitle className="text-lg">SMS Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Receive real-time updates about your queue position via SMS
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Location Flexibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                No need to wait in the physical location. Join from anywhere!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Track your position and estimated wait time in real-time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualQueuePage;
