
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatWaitTime } from '@/lib/queue';

const QueuePositionTracker = () => {
  const { user } = useAuth();
  const [position, setPosition] = useState<number | null>(null);
  const [estimatedWait, setEstimatedWait] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queueStatus, setQueueStatus] = useState<string>('closed');

  useEffect(() => {
    const fetchQueuePosition = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch current customer's position from queue
        const { data: queueData, error: queueError } = await supabase.functions.invoke('queue-position', {
          method: 'POST',
          body: JSON.stringify({ customerId: user.id })
        });
        
        if (queueError) throw queueError;
        
        if (queueData) {
          setPosition(queueData.position || null);
          setEstimatedWait(queueData.estimatedWaitTime || null);
          setQueueStatus(queueData.queueStatus || 'closed');
        } else {
          setPosition(null);
          setEstimatedWait(null);
        }
      } catch (err) {
        console.error('Error fetching queue position:', err);
        setError('Unable to retrieve your position in queue');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQueuePosition();
    
    // Set up interval to refresh position every 30 seconds
    const interval = setInterval(fetchQueuePosition, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id]);
  
  const getStatusColor = () => {
    if (queueStatus === 'open') {
      return position !== null ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100';
    }
    return 'bg-gray-100 text-gray-800';
  };
  
  const getStatusMessage = () => {
    if (queueStatus === 'closed') return 'Queue is currently closed';
    if (position === null) return 'You\'re not in the queue';
    return position === 0 ? 'It\'s your turn!' : `You are #${position} in line`;
  };
  
  return (
    <Card className="overflow-hidden border-t-4 border-t-blue-500">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-indigo-50">
        <CardTitle className="flex justify-between items-center">
          <span>Queue Status</span>
          <Badge variant="secondary" className={getStatusColor()}>
            {queueStatus === 'open' ? 'Open' : 'Closed'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center py-6 text-center">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
            <p>Checking your position...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center items-center">
              <div className="text-center">
                <div className="flex justify-center">
                  <User className="h-10 w-10 text-blue-500 mb-2" />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {getStatusMessage()}
                </h3>
                {position !== null && position > 0 && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Estimated wait: {estimatedWait ? formatWaitTime(estimatedWait) : 'Calculating...'}</span>
                  </div>
                )}
              </div>
            </div>
            
            {position === null && queueStatus === 'open' && (
              <div className="text-center text-sm text-muted-foreground">
                <p>You are not currently in the queue.</p>
                <p>Check in or make an appointment to join.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueuePositionTracker;
