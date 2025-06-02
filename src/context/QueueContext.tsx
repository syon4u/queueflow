
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  service: string;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'serving' | 'served' | 'no_show';
  joinedAt: Date;
  estimatedWaitTime?: number;
  notes?: string;
}

export interface QueueStats {
  totalCustomers: number;
  waitingCustomers: number;
  servedCustomers: number;
  noShowCustomers: number;
  averageWaitTime: number;
}

interface QueueContextType {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  stats: QueueStats;
  queueStatus: 'open' | 'closed';
  locationId: string;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => void;
  callNextCustomer: () => void;
  markAsServed: () => void;
  markAsNoShow: () => void;
  removeCustomer: (id: string) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  getQueuePosition: (customerId: string) => number;
  getEstimatedWaitTime: (customerId: string) => number;
  resetQueue: () => void;
  setQueueStatus: (status: 'open' | 'closed') => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

// Sample data for testing
const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '(555) 123-4567',
    service: 'Business License',
    priority: 'normal',
    status: 'waiting',
    joinedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    notes: 'Needs help with renewal paperwork'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    phone: '(555) 987-6543',
    service: 'Code Violation',
    priority: 'priority',
    status: 'waiting',
    joinedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    notes: 'Urgent - property inspection needed'
  },
  {
    id: '3',
    name: 'David Johnson',
    service: 'General Inquiry',
    priority: 'normal',
    status: 'waiting',
    joinedAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  }
];

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState<'open' | 'closed'>('open');
  const [locationId] = useState('default-location');
  const { toast } = useToast();

  // Calculate stats dynamically
  const stats: QueueStats = React.useMemo(() => {
    const totalCustomers = customers.length;
    const waitingCustomers = customers.filter(c => c.status === 'waiting').length;
    const servedCustomers = customers.filter(c => c.status === 'served').length;
    const noShowCustomers = customers.filter(c => c.status === 'no_show').length;
    
    // Calculate average wait time for served customers
    const servedWithWaitTime = customers.filter(c => c.status === 'served');
    const averageWaitTime = servedWithWaitTime.length > 0 
      ? servedWithWaitTime.reduce((acc, customer) => {
          const waitTime = Math.floor((new Date().getTime() - customer.joinedAt.getTime()) / 60000);
          return acc + waitTime;
        }, 0) / servedWithWaitTime.length
      : 0;

    return {
      totalCustomers,
      waitingCustomers,
      servedCustomers,
      noShowCustomers,
      averageWaitTime
    };
  }, [customers]);

  const addCustomer = (customerData: Omit<Customer, 'id' | 'joinedAt' | 'status'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      joinedAt: new Date(),
      status: 'waiting'
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: 'Customer Added',
      description: `${newCustomer.name} has been added to the queue`,
    });
  };

  const callNextCustomer = async () => {
    if (currentCustomer) {
      toast({
        title: 'Customer Already Being Served',
        description: 'Please complete the current customer before calling the next one.',
        variant: 'destructive',
      });
      return;
    }

    const waitingCustomers = customers
      .filter(c => c.status === 'waiting')
      .sort((a, b) => {
        // Priority customers first
        if (a.priority !== b.priority) {
          return a.priority === 'priority' ? -1 : 1;
        }
        // Then by join time
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });

    if (waitingCustomers.length === 0) {
      toast({
        title: 'No Customers Waiting',
        description: 'The queue is currently empty.',
      });
      return;
    }

    setIsLoading(true);
    const nextCustomer = waitingCustomers[0];

    // Simulate API call delay
    setTimeout(() => {
      setCurrentCustomer({ ...nextCustomer, status: 'serving' });
      setCustomers(prev => 
        prev.map(c => 
          c.id === nextCustomer.id 
            ? { ...c, status: 'serving' }
            : c
        )
      );
      setIsLoading(false);
      
      toast({
        title: 'Customer Called',
        description: `${nextCustomer.name} is now being served`,
      });
    }, 1000);
  };

  const markAsServed = async () => {
    if (!currentCustomer) return;

    setIsLoading(true);
    const customerId = currentCustomer.id;

    // Simulate API call delay
    setTimeout(() => {
      setCustomers(prev => 
        prev.map(c => 
          c.id === customerId 
            ? { ...c, status: 'served' }
            : c
        )
      );
      setCurrentCustomer(null);
      setIsLoading(false);
      
      toast({
        title: 'Customer Served',
        description: `${currentCustomer.name} has been marked as served`,
      });
    }, 500);
  };

  const markAsNoShow = async () => {
    if (!currentCustomer) return;

    setIsLoading(true);
    const customerId = currentCustomer.id;

    // Simulate API call delay
    setTimeout(() => {
      setCustomers(prev => 
        prev.map(c => 
          c.id === customerId 
            ? { ...c, status: 'no_show' }
            : c
        )
      );
      setCurrentCustomer(null);
      setIsLoading(false);
      
      toast({
        title: 'Marked as No-Show',
        description: `${currentCustomer.name} has been marked as no-show`,
      });
    }, 500);
  };

  const removeCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    if (currentCustomer?.id === id) {
      setCurrentCustomer(null);
    }
    toast({
      title: 'Customer Removed',
      description: 'Customer has been removed from the queue',
    });
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    );
    
    if (currentCustomer?.id === id) {
      setCurrentCustomer(prev => prev ? { ...prev, ...updates } : null);
    }
  };

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
    return position === -1 ? 0 : position * 15; // 15 minutes per customer estimate
  };

  const resetQueue = () => {
    setCustomers([]);
    setCurrentCustomer(null);
    toast({
      title: 'Queue Reset',
      description: 'All customers have been removed from the queue',
    });
  };

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
