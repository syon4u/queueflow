
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  joinedAt: Date;
  serviceId?: string;
  estimatedWaitTime?: number;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'serving' | 'served' | 'no-show';
};

export type QueueStats = {
  totalCustomers: number;
  waitingCustomers: number;
  servedCustomers: number;
  noShowCustomers: number;
  averageWaitTime: number;
};

type QueueContextType = {
  customers: Customer[];
  currentCustomer: Customer | null;
  stats: QueueStats;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => void;
  removeCustomer: (id: string) => void;
  callNextCustomer: () => void;
  markAsServed: () => void;
  markAsNoShow: () => void;
  resetQueue: () => void;
};

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  
  // Calculate and update stats
  const stats: QueueStats = React.useMemo(() => {
    const waitingCustomers = customers.filter(c => c.status === 'waiting').length;
    const servedCustomers = customers.filter(c => c.status === 'served').length;
    const noShowCustomers = customers.filter(c => c.status === 'no-show').length;
    
    // Calculate average wait time for served customers
    let totalWaitTime = 0;
    const servedCustomersArray = customers.filter(c => c.status === 'served');
    servedCustomersArray.forEach(customer => {
      if (customer.estimatedWaitTime) {
        totalWaitTime += customer.estimatedWaitTime;
      }
    });
    
    const averageWaitTime = servedCustomersArray.length > 0 
      ? Math.round(totalWaitTime / servedCustomersArray.length) 
      : 0;
    
    return {
      totalCustomers: customers.length,
      waitingCustomers,
      servedCustomers,
      noShowCustomers,
      averageWaitTime,
    };
  }, [customers]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Math.random().toString(36).substring(2, 9),
      joinedAt: new Date(),
      status: 'waiting',
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    toast.success(`Added ${customer.name} to the queue`);
  };

  const removeCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    
    // If removing current customer, clear current customer
    if (currentCustomer && currentCustomer.id === id) {
      setCurrentCustomer(null);
    }
    
    toast.info('Customer removed from queue');
  };

  const callNextCustomer = () => {
    // If there's a current customer being served, mark them as served first
    if (currentCustomer && currentCustomer.status === 'serving') {
      markAsServed();
    }
    
    // Get next customer in queue (prioritize priority customers)
    const priorityCustomers = customers.filter(
      c => c.status === 'waiting' && c.priority === 'priority'
    );
    const normalCustomers = customers.filter(
      c => c.status === 'waiting' && c.priority === 'normal'
    );
    
    const nextCustomer = priorityCustomers.length > 0 
      ? priorityCustomers[0] 
      : normalCustomers.length > 0 
        ? normalCustomers[0] 
        : null;
    
    if (nextCustomer) {
      // Update customer status
      setCustomers(prev => prev.map(c => 
        c.id === nextCustomer.id ? { ...c, status: 'serving' } : c
      ));
      
      // Set as current customer
      setCurrentCustomer({ ...nextCustomer, status: 'serving' });
      toast.success(`Now serving ${nextCustomer.name}`);
    } else {
      toast.info('Queue is empty');
    }
  };

  const markAsServed = () => {
    if (!currentCustomer) {
      toast.error('No customer currently being served');
      return;
    }
    
    setCustomers(prev => prev.map(c => 
      c.id === currentCustomer.id ? { ...c, status: 'served' } : c
    ));
    
    setCurrentCustomer(null);
    toast.success('Customer marked as served');
  };

  const markAsNoShow = () => {
    if (!currentCustomer) {
      toast.error('No customer currently being served');
      return;
    }
    
    setCustomers(prev => prev.map(c => 
      c.id === currentCustomer.id ? { ...c, status: 'no-show' } : c
    ));
    
    setCurrentCustomer(null);
    toast.info('Customer marked as no-show');
  };

  const resetQueue = () => {
    setCustomers([]);
    setCurrentCustomer(null);
    toast.info('Queue has been reset');
  };

  return (
    <QueueContext.Provider value={{
      customers,
      currentCustomer,
      stats,
      addCustomer,
      removeCustomer,
      callNextCustomer,
      markAsServed,
      markAsNoShow,
      resetQueue,
    }}>
      {children}
    </QueueContext.Provider>
  );
};
