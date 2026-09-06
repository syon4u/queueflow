import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, MapPin, Bell, QrCode, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatWaitTime } from '@/lib/queue';
import { customerName, findPublicAppointment } from '@/lib/publicQueue';

interface MobileQueueTrackerProps {
  appointmentId: string;
  onNotificationToggle?: (enabled: boolean) => void;
}

interface QueuePosition {
  appointment_id: string;
  status: string;
  position?: number;
  total_in_queue?: number;
  estimated_wait_time_minutes?: number;
  current_wait_time_minutes?: number;
  customer_name: string;
  service_name: string;
  check_in_time?: string;
  ticket_number: string;
  location_id: string;
}

export const MobileQueueTracker: React.FC<MobileQueueTrackerProps> = ({
  appointmentId,
  onNotificationToggle
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch queue position data
  const { data: queueData, isLoading, error } = useQuery({
    queryKey: ['queue-position', appointmentId],
    queryFn: async (): Promise<QueuePosition> => {
      // The queue-position edge function rejects anonymous callers (401); the
      // public RPC is scoped to this one appointment id instead.
      const appointment = await findPublicAppointment({ appointmentId });
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      const currentWait = appointment.check_in_time
        ? Math.max(0, Math.floor((Date.now() - new Date(appointment.check_in_time).getTime()) / 60000))
        : undefined;
      return {
        appointment_id: appointment.appointment_id,
        status: appointment.status,
        position: appointment.position ?? undefined,
        total_in_queue: appointment.total_in_queue,
        estimated_wait_time_minutes: appointment.estimated_wait_minutes,
        current_wait_time_minutes: currentWait,
        customer_name: customerName(appointment),
        service_name: appointment.service_name || 'Service',
        check_in_time: appointment.check_in_time || undefined,
        ticket_number: appointment.ticket_number,
        location_id: appointment.location_id || '',
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!appointmentId
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!appointmentId) return;

    const channel = supabase
      .channel('mobile-queue-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `id=eq.${appointmentId}`
        },
        (payload) => {
          console.log('Queue update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['queue-position', appointmentId] });
          
          // Show notification for important status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old?.status) {
            if (payload.new.status === 'in_progress') {
              toast({
                title: "You're Being Called! 🔔",
                description: "Please proceed to the service counter.",
                className: "bg-green-50 border-green-200",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [appointmentId, queryClient, toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['queue-position', appointmentId] });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    onNotificationToggle?.(newState);
    
    toast({
      title: newState ? 'Notifications Enabled' : 'Notifications Disabled',
      description: newState 
        ? 'You\'ll receive updates about your queue position' 
        : 'Queue notifications have been turned off',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your queue position...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !queueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">Unable to load queue information</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { text: 'Booked – check in on arrival', color: 'bg-amber-100 text-amber-800', emoji: '📅' };
      case 'checked_in':
        return { text: 'In Queue', color: 'bg-blue-100 text-blue-800', emoji: '⏳' };
      case 'in_progress':
        return { text: 'Being Called!', color: 'bg-green-100 text-green-800', emoji: '🔔' };
      case 'completed':
        return { text: 'Completed', color: 'bg-gray-100 text-gray-800', emoji: '✅' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', emoji: '❓' };
    }
  };

  const statusDisplay = getStatusDisplay(queueData.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Queue Position</h1>
              <p className="text-sm text-gray-600">Ticket #{queueData.ticket_number}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleNotifications}
                className={notificationsEnabled ? 'text-blue-600' : 'text-gray-400'}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Status Badge */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge className={`${statusDisplay.color} px-4 py-2 text-lg`}>
                {statusDisplay.emoji} {statusDisplay.text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Position Display */}
        {queueData.position && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold text-blue-600">
                  #{queueData.position}
                </div>
                <p className="text-gray-600">Your position in line</p>
                {queueData.total_in_queue && (
                  <p className="text-sm text-gray-500">
                    {queueData.total_in_queue - queueData.position} people ahead of you
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wait Time Info */}
        <div className="grid grid-cols-2 gap-4">
          {queueData.estimated_wait_time_minutes !== undefined && (
            <Card>
              <CardContent className="pt-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold text-orange-900">
                  {formatWaitTime(queueData.estimated_wait_time_minutes)}
                </p>
                <p className="text-sm text-gray-600">Est. wait time</p>
              </CardContent>
            </Card>
          )}

          {queueData.current_wait_time_minutes !== undefined && (
            <Card>
              <CardContent className="pt-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-900">
                  {formatWaitTime(queueData.current_wait_time_minutes)}
                </p>
                <p className="text-sm text-gray-600">Current wait</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{queueData.service_name}</span>
            </div>
            <div className="text-sm text-gray-600">
              Customer: {queueData.customer_name}
            </div>
            {queueData.check_in_time && (
              <div className="text-sm text-gray-600">
                Checked in: {new Date(queueData.check_in_time).toLocaleTimeString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        {queueData.status === 'in_progress' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-green-600 font-semibold mb-2">
                  🔔 You're being called!
                </div>
                <p className="text-green-700 text-sm">
                  Please proceed to the service counter now.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code for sharing */}
        <Card>
          <CardContent className="pt-4">
            <Button variant="outline" className="w-full" size="lg">
              <QrCode className="h-5 w-5 mr-2" />
              Show QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
