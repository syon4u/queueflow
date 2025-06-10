
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { VirtualQueueJoin } from '@/components/queue/VirtualQueueJoin';
import { VirtualQueueTicket } from '@/components/queue/VirtualQueueTicket';
import { QueuePositionTracker } from '@/components/customer/QueuePositionTracker';
import { Clock, Users, MapPin, CheckCircle } from 'lucide-react';

const VirtualQueuePage = () => {
  const [hasJoinedQueue, setHasJoinedQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);

  const handleJoinQueue = (customerInfo: any) => {
    console.log('Customer joined queue:', customerInfo);
    setHasJoinedQueue(true);
    setQueuePosition(Math.floor(Math.random() * 10) + 1);
    setEstimatedWait(Math.floor(Math.random() * 30) + 10);
  };

  const handleLeaveQueue = () => {
    setHasJoinedQueue(false);
    setQueuePosition(0);
    setEstimatedWait(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Virtual Queue</h1>
          <p className="text-xl text-gray-600">
            Join the virtual queue and avoid waiting in line
          </p>
        </div>

        {!hasJoinedQueue ? (
          <VirtualQueueJoin onJoinQueue={handleJoinQueue} />
        ) : (
          <div className="space-y-6">
            <VirtualQueueTicket 
              position={queuePosition}
              estimatedWait={estimatedWait}
              onLeaveQueue={handleLeaveQueue}
            />
            
            <QueuePositionTracker 
              currentPosition={queuePosition}
              estimatedWait={estimatedWait}
            />
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Save Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                No need to wait in physical lines. Get real-time updates on your position.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Live Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Receive SMS notifications about your queue status and estimated wait times.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>Flexible Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Wait from anywhere and return when it's almost your turn.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualQueuePage;
