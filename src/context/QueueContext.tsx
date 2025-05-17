
import React, { createContext, useContext } from 'react';
import { useQueueOperations } from '@/hooks/useQueueOperations';
import { useLocationStatus } from '@/hooks/useLocationStatus';
import { QueueContextType, Customer } from '@/types/queue';

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the extracted hooks to manage state
  const locationStatus = useLocationStatus();
  const queueOps = useQueueOperations();

  const value: QueueContextType = {
    ...locationStatus,
    ...queueOps
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

// Re-export Customer type from the types file for backward compatibility
export type { Customer } from '@/types/queue';
