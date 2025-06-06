
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QueuePositionDisplayProps {
  confirmationCode: string;
}

interface QueueInfo {
  position: number;
  estimatedWaitTime: number;
  status: string;
  serviceName: string;
  locationName: string;
  totalAhead: number;
}

export const QueuePositionDisplay: React.FC<QueuePositionDisplayProps> = ({ 
  confirmationCode 
}) => {
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQueuePosition = async () => {
      try {
        let appointment = null;

        // Check if it's a customer confirmation number (CUST-XXXXXXXX)
        if (confirmationCode.startsWith('CUST-')) {
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select(`
              id,
              appointments!appointments_customer_id_fkey(
                id,
                status,
                check_in_time,
                location_id,
                service_id,
                scheduled_time,
                locations!appointments_location_id_fkey(name),
                services!appointments_service_id_fkey(name, duration)
              )
            `)
            .eq('confirmation_number', confirmationCode)
            .maybeSingle();

          if (customerError) throw customerError;

          if (customerData && customerData.appointments && customerData.appointments.length > 0) {
            // Get the most recent appointment
            appointment = customerData.appointments
              .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime())[0];
          }
        } else if (confirmationCode.startsWith('APT-')) {
          // Handle appointment confirmation format (APT-XXXXXXXX)
          const appointmentIdPrefix = confirmationCode.substring(4).toLowerCase();
          
          const { data: appointments, error } = await supabase
            .from('appointments')
            .select(`
              id,
              status,
              check_in_time,
              location_id,
              service_id,
              scheduled_time,
              locations!appointments_location_id_fkey(name),
              services!appointments_service_id_fkey(name, duration)
            `)
            .gte('scheduled_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('scheduled_time', { ascending: false });

          if (error) throw error;

          appointment = appointments?.find(apt => 
            apt.id.toLowerCase().startsWith(appointmentIdPrefix)
          );
        }

        if (!appointment) {
          console.error('No appointment found for confirmation code:', confirmationCode);
          return;
        }

        // Get all checked-in appointments for this location to calculate position
        const { data: queueData, error: queueError } = await supabase
          .from('appointments')
          .select('id, check_in_time')
          .eq('location_id', appointment.location_id)
          .eq('status', 'checked_in')
          .order('check_in_time', { ascending: true });

        if (queueError) {
          console.error('Error fetching queue:', queueError);
          return;
        }

        const position = queueData.findIndex(apt => apt.id === appointment.id) + 1;
        const totalAhead = position - 1;
        const estimatedWaitTime = totalAhead * (appointment.services?.duration || 30);

        setQueueInfo({
          position,
          estimatedWaitTime,
          status: appointment.status,
          serviceName: appointment.services?.name || 'Service',
          locationName: appointment.locations?.name || 'Location',
          totalAhead
        });

      } catch (error) {
        console.error('Error fetching queue position:', error);
        toast({
          title: 'Error',
          description: 'Unable to fetch queue position',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQueuePosition();

    // Set up real-time subscription for status updates
    const channel = supabase
      .channel('customer-queue-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          // Refetch queue position when any appointment is updated
          fetchQueuePosition();
          
          // Show notification for status changes if it's our appointment
          if (payload.new.status === 'in_progress') {
            toast({
              title: 'You\'re Being Called!',
              description: 'Please proceed to the service counter.',
            });
          } else if (payload.new.status === 'completed') {
            toast({
              title: 'Service Completed',
              description: 'Thank you for visiting us today.',
            });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Refresh position every 30 seconds
    const interval = setInterval(fetchQueuePosition, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [confirmationCode, toast]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading your queue position...</div>
        </CardContent>
      </Card>
    );
  }

  if (!queueInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Queue information not available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'checked_in': return 'You are in the queue';
      case 'in_progress': return 'You are being called!';
      case 'completed': return 'Service completed';
      default: return 'Status unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Queue Position</span>
          <Badge className={getStatusColor(queueInfo.status)}>
            {getStatusMessage(queueInfo.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            #{queueInfo.position}
          </div>
          <p className="text-gray-600">Your position in line</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <p className="text-2xl font-bold">{queueInfo.totalAhead}</p>
            <p className="text-sm text-gray-600">People ahead</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <p className="text-2xl font-bold">{queueInfo.estimatedWaitTime}m</p>
            <p className="text-sm text-gray-600">Est. wait time</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{queueInfo.locationName} • {queueInfo.serviceName}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">
              {isConnected ? 'Live updates active' : 'Connection lost'}
            </span>
          </div>
        </div>

        {queueInfo.status === 'in_progress' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium text-center">
              🔔 You're being called! Please proceed to the service counter.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
