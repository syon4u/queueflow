
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useLocationStatus() {
  const [queueStatus, setQueueStatus] = useState<string>('closed');
  const [locationId, setLocationId] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch location ID and queue status when the component mounts
  useEffect(() => {
    const fetchQueueStatus = async () => {
      if (!user) return;
      
      try {
        // First get staff's location_id
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('location_id')
          .eq('id', user.id)
          .single();
        
        if (staffError) throw staffError;
        
        if (staffData && staffData.location_id) {
          setLocationId(staffData.location_id);
          
          // Now get the queue status for this location
          const { data: locationData, error: locationError } = await supabase
            .from('locations')
            .select('queue_status')
            .eq('id', staffData.location_id)
            .single();
          
          if (locationError) throw locationError;
          
          if (locationData) {
            setQueueStatus(locationData.queue_status as string || 'closed');
          }
        }
      } catch (error) {
        console.error('Error fetching queue status:', error);
      }
    };
    
    fetchQueueStatus();
    
    // Subscribe to queue changes
    const queueSubscription = supabase
      .channel('queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, payload => {
        if (payload.new) {
          const newData = payload.new as { queue_status?: string };
          if (newData.queue_status) {
            setQueueStatus(newData.queue_status);
          }
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(queueSubscription);
    };
  }, [user]);

  return {
    queueStatus,
    setQueueStatus,
    locationId
  };
}
