
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Wifi, WifiOff, Settings } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatTime } from '@/lib/queue';
import { useSearchParams } from 'react-router-dom';
import { getSignageBoard } from '@/lib/publicQueue';
import { Button } from '@/components/ui/button';

interface QueueDisplayData {
  location_id: string;
  location_name: string;
  currently_serving: number;
  total_waiting: number;
  completed_today: number;
  average_wait_time_minutes: number;
  queue_status: 'active' | 'empty' | 'closed';
  capacity: {
    current: number;
    maximum: number;
    utilization_percentage: number;
  };
  queue: {
    waiting: Array<{
      ticket_number: string;
      customer_name: string;
      service_name: string;
      position: number;
      current_wait_time_minutes: number;
    }>;
    currently_serving: Array<{
      ticket_number: string;
      customer_name: string;
      service_name: string;
    }>;
  };
  last_updated: string;
}

export const DigitalSignageDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  const [displayMode, setDisplayMode] = useState<'full' | 'compact'>('full');
  // ?location=<uuid> pins the board to one site; otherwise the first open location.
  const [searchParams] = useSearchParams();
  const requestedLocationId = searchParams.get('location');
  const { data: defaultLocationId } = useQuery({
    queryKey: ['signage-default-location'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id')
        .eq('queue_status', 'open')
        .order('name')
        .limit(1);
      if (error) throw error;
      return data?.[0]?.id ?? null;
    },
    enabled: !requestedLocationId,
    staleTime: 5 * 60 * 1000,
  });
  const selectedLocationId = requestedLocationId ?? defaultLocationId ?? '';
  const queryClient = useQueryClient();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch queue data from our edge function
  const { data: queueData, isLoading, error } = useQuery({
    queryKey: ['digital-signage', selectedLocationId],
    // Public RPC: the lobby screen has no user session, so the edge function's
    // bearer-token fetch always failed with 401.
    queryFn: (): Promise<QueueDisplayData> => getSignageBoard(selectedLocationId),
    refetchInterval: refreshInterval,
    enabled: isOnline && !!selectedLocationId
  });

  // Set up real-time subscription for queue updates
  useEffect(() => {
    if (!selectedLocationId) return;

    const channel = supabase
      .channel('signage-queue-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `location_id=eq.${selectedLocationId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['digital-signage', selectedLocationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedLocationId, queryClient]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'empty':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Loading Queue Information...</h2>
        </div>
      </div>
    );
  }

  if (error || !queueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <WifiOff className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-lg">Unable to load queue information</p>
        </div>
      </div>
    );
  }

  if (displayMode === 'compact') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">{queueData.location_name}</h1>
            <p className="text-xl opacity-80">Queue Status</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono">{formatTime(currentTime)}</div>
            <div className="flex items-center gap-2 mt-2">
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl font-bold text-green-400">{queueData.currently_serving}</div>
              <p className="text-xl mt-2">Currently Serving</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl font-bold text-yellow-400">{queueData.total_waiting}</div>
              <p className="text-xl mt-2">People Waiting</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl font-bold text-blue-400">{queueData.average_wait_time_minutes}</div>
              <p className="text-xl mt-2">Avg Wait (min)</p>
            </CardContent>
          </Card>
        </div>

        {/* Currently Serving */}
        {queueData.queue.currently_serving.length > 0 && (
          <Card className="bg-green-500/20 border-green-400/30 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-2xl">🔔 Now Being Served</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queueData.queue.currently_serving.map((customer, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                    <div>
                      <span className="text-2xl font-bold text-green-400">#{customer.ticket_number}</span>
                      <span className="text-xl ml-4">{customer.service_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Button */}
        <Button
          onClick={() => setDisplayMode('full')}
          className="fixed bottom-4 right-4 opacity-20 hover:opacity-100 transition-opacity"
          variant="ghost"
          size="sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold">{queueData.location_name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge className={getStatusColor(queueData.queue_status)}>
              {queueData.queue_status === 'active' ? '🟢 Queue Active' : 
               queueData.queue_status === 'empty' ? '🔵 Queue Empty' : 
               '🔴 Queue Closed'}
            </Badge>
            <span className="text-xl opacity-80">
              Last updated: {new Date(queueData.last_updated).toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono">{formatTime(currentTime)}</div>
          <div className="text-lg opacity-80">{currentTime.toLocaleDateString()}</div>
          <div className="flex items-center gap-2 mt-2">
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="w-6 h-6" />
                Queue Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400">{queueData.currently_serving}</div>
                  <p className="text-lg">Currently Serving</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400">{queueData.total_waiting}</div>
                  <p className="text-lg">People Waiting</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">{queueData.completed_today}</div>
                  <p className="text-lg">Served Today</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400">{queueData.average_wait_time_minutes}</div>
                  <p className="text-lg">Avg Wait (min)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Info */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Capacity Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Capacity:</span>
                  <span className="font-bold">{queueData.capacity.current}/{queueData.capacity.maximum}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${queueData.capacity.utilization_percentage}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm opacity-80">
                  {queueData.capacity.utilization_percentage}% Utilized
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Queue Details */}
        <div className="space-y-6">
          {/* Currently Being Served */}
          {queueData.queue.currently_serving.length > 0 && (
            <Card className="bg-green-500/20 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-2xl text-green-400">🔔 Now Being Served</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queueData.queue.currently_serving.map((customer, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                      <div>
                        <span className="text-2xl font-bold text-green-400">#{customer.ticket_number}</span>
                        <div className="text-lg">{customer.service_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Up */}
          {queueData.queue.waiting.length > 0 && (
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">⏳ Next in Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {queueData.queue.waiting.slice(0, 5).map((customer, index) => (
                    <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-500/20 border border-yellow-400/30' : 'bg-white/5'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-xl font-bold ${
                          index === 0 ? 'text-yellow-400' : 'text-white'
                        }`}>
                          #{customer.ticket_number}
                        </span>
                        <span className="text-sm opacity-80">{customer.service_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Position {customer.position}</div>
                        <div className="text-xs opacity-60">
                          {customer.current_wait_time_minutes}m waiting
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Queue Message */}
          {queueData.queue_status === 'empty' && (
            <Card className="bg-blue-500/20 border-blue-400/30">
              <CardContent className="pt-6 text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-2">No Wait Time!</h3>
                <p className="text-lg">Walk right up to be served</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center opacity-60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Updates every {refreshInterval / 1000} seconds</span>
        </div>
        <Button
          onClick={() => setDisplayMode('compact')}
          variant="ghost"
          size="sm"
          className="opacity-50 hover:opacity-100"
        >
          <Settings className="w-4 h-4 mr-2" />
          Compact View
        </Button>
      </div>
    </div>
  );
};
