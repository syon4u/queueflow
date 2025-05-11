import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Define the context type
interface QueueContextType {
  queueStatus: string;
  setQueueStatus: React.Dispatch<React.SetStateAction<string>>;
  locationId: string | null;
  currentQueueNumber: number | null;
  setCurrentQueueNumber: React.Dispatch<React.SetStateAction<number | null>>;
  waitingCount: number;
  setWaitingCount: React.Dispatch<React.SetStateAction<number>>;
  averageWaitTime: number | null;
  setAverageWaitTime: React.Dispatch<React.SetStateAction<number | null>>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queueStatus, setQueueStatus] = useState<string>('closed');
  const [currentQueueNumber, setCurrentQueueNumber] = useState<number | null>(null);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [averageWaitTime, setAverageWaitTime] = useState<number | null>(null);
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
            setQueueStatus(locationData.queue_status || 'closed');
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
        if (payload.new && payload.new.queue_status) {
          setQueueStatus(payload.new.queue_status);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(queueSubscription);
    };
  }, [user]);

  const value = {
    queueStatus,
    setQueueStatus,
    currentQueueNumber,
    setCurrentQueueNumber,
    waitingCount,
    setWaitingCount,
    averageWaitTime,
    setAverageWaitTime,
    locationId,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
