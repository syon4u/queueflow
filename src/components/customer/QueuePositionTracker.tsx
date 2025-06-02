
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { formatWaitTime } from '@/lib/queue';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserAppointment {
  id: string;
  status: string;
  scheduled_time: string;
  check_in_time: string | null;
  services: {
    name: string;
    duration: number;
  } | null;
  locations: {
    name: string;
  } | null;
}

const QueuePositionTracker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const [userAppointment, setUserAppointment] = useState<UserAppointment | null>(null);
  const [previousPosition, setPreviousPosition] = useState<number | null>(null);
  
  useEffect(() => {
    if (!user) return;

    const fetchUserPosition = async () => {
      try {
        // Get user's active appointment
        const { data: userAppt, error: userError } = await supabase
          .from('appointments')
          .select(`
            *,
            services (name, duration),
            locations (name)
          `)
          .eq('customer_id', user.id)
          .in('status', ['checked_in', 'scheduled'])
          .order('scheduled_time', { ascending: false })
          .limit(1)
          .single();

        if (userError || !userAppt) {
          setUserAppointment(null);
          setUserPosition(null);
          setEstimatedWaitTime(null);
          return;
        }

        setUserAppointment(userAppt);

        // If not checked in yet, no position
        if (userAppt.status !== 'checked_in') {
          setUserPosition(null);
          setEstimatedWaitTime(null);
          return;
        }

        // Get all checked-in appointments at the same location
        const { data: queueAppointments, error: queueError } = await supabase
          .from('appointments')
          .select('id, check_in_time')
          .eq('location_id', userAppt.location_id)
          .eq('status', 'checked_in')
          .not('check_in_time', 'is', null)
          .order('check_in_time', { ascending: true });

        if (queueError) {
          console.error('Error fetching queue:', queueError);
          return;
        }

        // Find user's position in the queue
        const position = queueAppointments.findIndex(appt => appt.id === userAppt.id) + 1;
        setUserPosition(position > 0 ? position : null);

        // Calculate estimated wait time (15 minutes per person ahead)
        const waitTime = position > 1 ? (position - 1) * 15 : 0;
        setEstimatedWaitTime(waitTime);

      } catch (error) {
        console.error('Error fetching user position:', error);
      }
    };

    fetchUserPosition();

    // Set up realtime subscription
    const channel = supabase
      .channel('user-queue-position')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'appointments'
        }, 
        () => {
          fetchUserPosition();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Effect to detect position changes and notify the user
  useEffect(() => {
    if (userPosition === null || previousPosition === null) {
      setPreviousPosition(userPosition);
      return;
    }
    
    // If the position has improved (number decreased)
    if (userPosition < previousPosition) {
      toast({
        title: "Queue position update",
        description: `Your position has moved up! You are now ${userPosition === 1 ? 'next' : `#${userPosition}`} in line.`,
        duration: 5000,
      });
      
      // If the user is next, send a more urgent notification
      if (userPosition === 1) {
        toast({
          title: "You're next!",
          description: "Please be ready, you will be called soon.",
          variant: "default",
          duration: 8000,
        });
      }
    }
    
    setPreviousPosition(userPosition);
  }, [userPosition, previousPosition, toast]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue Status</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>Please log in to view your queue position.</p>
        </CardContent>
      </Card>
    );
  }

  if (!userAppointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue Status</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>You don't have any active appointments in the queue.</p>
        </CardContent>
      </Card>
    );
  }

  if (userAppointment.status !== 'checked_in') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointment Status</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-2">
            <p>You have an upcoming appointment but haven't checked in yet.</p>
            <div className="text-sm text-muted-foreground">
              <p>Service: {userAppointment.services?.name}</p>
              <p>Location: {userAppointment.locations?.name}</p>
              <p>Scheduled: {new Date(userAppointment.scheduled_time).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center justify-between">
          <span>Your Queue Position</span>
          {userPosition === 1 && (
            <Bell className="h-5 w-5 text-primary animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold mb-2">
            {userPosition === 1 ? (
              <span className="text-primary animate-pulse">You're Next!</span>
            ) : (
              <>{userPosition}</>
            )}
          </div>
          <Badge variant={userPosition && userPosition <= 3 ? "default" : "outline"}>
            {userPosition === 1 
              ? 'Please be ready' 
              : userPosition && userPosition > 1
                ? `${userPosition - 1} customer${userPosition - 1 !== 1 ? 's' : ''} ahead of you`
                : 'In queue'
            }
          </Badge>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Estimated Wait</p>
              <p className="font-medium">{formatWaitTime(estimatedWaitTime || 0)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Service</p>
              <p className="font-medium truncate">
                {userAppointment.services?.name || "General"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">Checked In</p>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium truncate">
                {userAppointment.locations?.name || "Main Office"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueuePositionTracker;
