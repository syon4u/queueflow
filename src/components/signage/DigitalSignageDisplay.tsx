
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Users, Clock, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface QueueItem {
  id: string;
  customer_name: string;
  service_name: string;
  ticket_number: string;
  status: string;
  check_in_time: string;
  estimated_wait: number;
}

interface LocationData {
  id: string;
  name: string;
  current_capacity: number;
  max_capacity: number;
}

export const DigitalSignageDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentlyServing, setCurrentlyServing] = useState<QueueItem[]>([]);
  const [upNext, setUpNext] = useState<QueueItem[]>([]);
  const [waitingCount, setWaitingCount] = useState(0);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch current queue data
  const { data: queueData } = useQuery({
    queryKey: ['signage-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          check_in_time,
          status,
          customers(first_name, last_name),
          services(name),
          locations(name)
        `)
        .in('status', ['checked_in', 'in_progress'])
        .order('check_in_time', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch location data
  const { data: locationData } = useQuery({
    queryKey: ['signage-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, current_capacity, max_capacity')
        .eq('queue_status', 'open');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  // WebSocket for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('signage-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Queue update received:', payload);
          // Trigger refetch of queue data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Process queue data
  useEffect(() => {
    if (queueData) {
      const serving = queueData
        .filter(item => item.status === 'in_progress')
        .slice(0, 4)
        .map(item => ({
          id: item.id,
          customer_name: `${item.customers?.first_name} ${item.customers?.last_name}`,
          service_name: item.services?.name || 'Service',
          ticket_number: item.id.slice(-8).toUpperCase(),
          status: item.status,
          check_in_time: item.check_in_time,
          estimated_wait: 0
        }));

      const next = queueData
        .filter(item => item.status === 'checked_in')
        .slice(0, 6)
        .map(item => ({
          id: item.id,
          customer_name: `${item.customers?.first_name} ${item.customers?.last_name}`,
          service_name: item.services?.name || 'Service',
          ticket_number: item.id.slice(-8).toUpperCase(),
          status: item.status,
          check_in_time: item.check_in_time,
          estimated_wait: Math.floor(Math.random() * 20) + 5 // Mock estimate
        }));

      setCurrentlyServing(serving);
      setUpNext(next);
      setWaitingCount(queueData.filter(item => item.status === 'checked_in').length);
    }
  }, [queueData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <Monitor className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-6xl font-bold mb-2">QueueFlow</h1>
            <p className="text-2xl text-blue-200">Live Queue Status</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-mono font-bold mb-2">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-xl text-blue-200">
            {currentTime.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Currently Being Served */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold">Now Serving</h2>
            </div>
            
            {currentlyServing.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl text-gray-300">No one currently being served</p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentlyServing.map((item) => (
                  <div
                    key={item.id}
                    className="bg-green-500/20 border-2 border-green-400 rounded-2xl p-6 flex items-center justify-between animate-pulse"
                  >
                    <div>
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        #{item.ticket_number}
                      </div>
                      <div className="text-xl text-gray-200">
                        {item.service_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        SERVING NOW
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Up Next */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold">Up Next</h2>
            </div>
            
            {upNext.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl text-gray-300">No one waiting</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upNext.map((item, index) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-4 flex items-center justify-between ${
                      index === 0 
                        ? 'bg-orange-500/30 border-2 border-orange-400' 
                        : 'bg-white/10 border border-white/20'
                    }`}
                  >
                    <div>
                      <div className={`text-2xl font-bold mb-1 ${
                        index === 0 ? 'text-orange-400' : 'text-blue-400'
                      }`}>
                        #{item.ticket_number}
                      </div>
                      <div className="text-lg text-gray-200">
                        {item.service_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        index === 0 ? 'text-orange-400' : 'text-gray-400'
                      }`}>
                        ~{item.estimated_wait} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-4xl font-bold mb-2">{waitingCount}</div>
            <div className="text-xl text-blue-200">People Waiting</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="text-4xl font-bold mb-2">{currentlyServing.length}</div>
            <div className="text-xl text-green-200">Being Served</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-4xl font-bold mb-2">
              {upNext.length > 0 ? `~${upNext[0]?.estimated_wait || 5}` : '0'}
            </div>
            <div className="text-xl text-orange-200">Est. Wait (min)</div>
          </CardContent>
        </Card>
      </div>

      {/* Location Info */}
      {locationData && locationData.length > 0 && (
        <div className="mt-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Current Location</h3>
                  <p className="text-xl text-blue-200">{locationData[0].name}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {locationData[0].current_capacity}/{locationData[0].max_capacity}
                  </div>
                  <div className="text-lg text-gray-300">Capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
