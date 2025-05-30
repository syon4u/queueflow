
import { useState } from 'react';
import { Customer, QueueStats } from '@/types/queue';
import { toast } from 'sonner';

export function useQueueOperations() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentQueueNumber, setCurrentQueueNumber] = useState<number | null>(null);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [averageWaitTime, setAverageWaitTime] = useState<number | null>(null);

  // Calculate stats whenever customers change
  const stats: QueueStats = {
    totalCustomers: customers.length,
    waitingCustomers: customers.filter(c => c.status === 'waiting').length,
    servedCustomers: customers.filter(c => c.status === 'served').length,
    noShowCustomers: customers.filter(c => c.status === 'no-show').length,
    averageWaitTime: averageWaitTime || 5, // Default to 5 minutes if no data
  };

  // Add a customer to the queue
  const addCustomer = (customerData: Omit<Customer, 'id' | 'status' | 'joinedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: crypto.randomUUID(),
      status: 'waiting',
      joinedAt: new Date(),
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    setWaitingCount(prev => prev + 1);
    
    toast.success(`Added ${newCustomer.name} to the queue`);
    return newCustomer;
  };
  
  // Call the next customer in the queue
  const callNextCustomer = () => {
    const waitingCustomers = customers
      .filter(c => c.status === 'waiting')
      .sort((a, b) => {
        // Sort by priority first
        if (a.priority !== b.priority) {
          return a.priority === 'priority' ? -1 : 1;
        }
        // Then by join time
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });
    
    if (waitingCustomers.length > 0) {
      const nextCustomer = waitingCustomers[0];
      
      setCustomers(prev => 
        prev.map(c => c.id === nextCustomer.id ? { ...c, status: 'serving' } : c)
      );
      
      setCurrentCustomer(nextCustomer);
      setCurrentQueueNumber(prevNum => (prevNum || 0) + 1);
      
      toast.success(`Now serving: ${nextCustomer.name}`);
    } else {
      toast.info("No customers waiting in queue");
    }
  };
  
  // Mark the current customer as served
  const markAsServed = () => {
    if (!currentCustomer) {
      toast.error("No customer being served");
      return;
    }
    
    setCustomers(prev => 
      prev.map(c => c.id === currentCustomer.id ? { ...c, status: 'served' } : c)
    );
    
    toast.success(`${currentCustomer.name} has been served`);
    setCurrentCustomer(null);
  };
  
  // Mark the current customer as a no-show
  const markAsNoShow = () => {
    if (!currentCustomer) {
      toast.error("No customer being served");
      return;
    }
    
    setCustomers(prev => 
      prev.map(c => c.id === currentCustomer.id ? { ...c, status: 'no-show' } : c)
    );
    
    toast.info(`${currentCustomer.name} marked as no-show`);
    setCurrentCustomer(null);
  };
  
  // Reset the entire queue
  const resetQueue = () => {
    setCustomers([]);
    setCurrentCustomer(null);
    setCurrentQueueNumber(0);
    setWaitingCount(0);
    
    toast.success("Queue has been reset");
  };

  return {
    customers,
    currentCustomer,
    currentQueueNumber,
    setCurrentQueueNumber,
    waitingCount,
    setWaitingCount,
    averageWaitTime,
    setAverageWaitTime,
    stats,
    addCustomer,
    callNextCustomer,
    markAsServed,
    markAsNoShow,
    resetQueue,
  };
}
