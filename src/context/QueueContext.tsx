
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QueueContextType, Customer } from './queue/types';
import { useQueueData } from './queue/useQueueData';
import { useQueueOperations } from './queue/useQueueOperations';
import { useQueueStats, useQueueHelpers } from './queue/useQueueStats';

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [queueStatus, setQueueStatus] = useState<'open' | 'closed'>('open');
  const [locationId] = useState('default-location');

  // Get queue data from database
  const { customers } = useQueueData();

  // Calculate stats
  const stats = useQueueStats(customers);

  // Get queue operations
  const {
    isLoading,
    addCustomer,
    callNextCustomer,
    markAsServed,
    markAsNoShow,
    removeCustomer,
    updateCustomer,
    resetQueue
  } = useQueueOperations(customers, currentCustomer);

  // Get helper functions
  const { getQueuePosition, getEstimatedWaitTime } = useQueueHelpers(customers, stats, currentCustomer);

  // Find current customer being served - with debugging
  useEffect(() => {
    console.log('QueueContext - Looking for serving customer among:', customers.length, 'customers');
    console.log('QueueContext - All customer statuses:', customers.map(c => ({ id: c.id, name: c.name, status: c.status })));
    
    const servingCustomer = customers.find(c => c.status === 'serving');
    console.log('QueueContext - Found serving customer:', servingCustomer);
    
    setCurrentCustomer(servingCustomer || null);
  }, [customers]);

  return (
    <QueueContext.Provider value={{
      customers,
      currentCustomer,
      isLoading,
      stats,
      queueStatus,
      locationId,
      addCustomer,
      callNextCustomer,
      markAsServed,
      markAsNoShow,
      removeCustomer,
      updateCustomer,
      getQueuePosition,
      getEstimatedWaitTime,
      resetQueue,
      setQueueStatus
    }}>
      {children}
    </QueueContext.Provider>
  );
};

// Export types for backward compatibility
export type { Customer, QueueStats } from './queue/types';
