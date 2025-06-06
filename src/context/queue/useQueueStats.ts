
import React from 'react';
import { Customer, QueueStats } from './types';

export const useQueueStats = (customers: Customer[]): QueueStats => {
  return React.useMemo(() => {
    const totalCustomers = customers.length;
    const waitingCustomers = customers.filter(c => c.status === 'waiting').length;
    const servedCustomers = customers.filter(c => c.status === 'served').length;
    const noShowCustomers = customers.filter(c => c.status === 'no_show').length;
    
    // Calculate average wait time for served customers
    const servedWithWaitTime = customers.filter(c => c.status === 'served' && c.calledAt);
    const averageWaitTime = servedWithWaitTime.length > 0 
      ? servedWithWaitTime.reduce((acc, customer) => {
          if (customer.calledAt) {
            const waitTime = Math.floor((customer.calledAt.getTime() - customer.joinedAt.getTime()) / 60000);
            return acc + waitTime;
          }
          return acc;
        }, 0) / servedWithWaitTime.length
      : 0;

    console.log('QueueStats - Real data calculated:', {
      totalCustomers,
      waitingCustomers,
      servedCustomers,
      noShowCustomers,
      averageWaitTime
    });

    return {
      totalCustomers,
      waitingCustomers,
      servedCustomers,
      noShowCustomers,
      averageWaitTime
    };
  }, [customers]);
};

export const useQueueHelpers = (customers: Customer[], stats: QueueStats, currentCustomer: Customer | null) => {
  const getQueuePosition = (customerId: string) => {
    const waitingCustomers = customers
      .filter(c => c.status === 'waiting')
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority === 'priority' ? -1 : 1;
        }
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });
    
    const index = waitingCustomers.findIndex(c => c.id === customerId);
    return index === -1 ? -1 : index + 1;
  };

  const getEstimatedWaitTime = (customerId: string) => {
    const position = getQueuePosition(customerId);
    if (position === -1) return 0;
    
    const avgServiceTime = Math.max(stats.averageWaitTime || 15, 10);
    const estimatedWait = position * avgServiceTime;
    const bufferTime = currentCustomer ? 5 : 0;
    
    return estimatedWait + bufferTime;
  };

  return {
    getQueuePosition,
    getEstimatedWaitTime
  };
};
