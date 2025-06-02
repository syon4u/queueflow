
import { Customer } from '@/context/QueueContext';

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const calculateWaitTime = (joinedAt: Date): number => {
  return Math.floor((new Date().getTime() - joinedAt.getTime()) / (1000 * 60));
};

export const getStatusColor = (status: Customer['status']): string => {
  switch (status) {
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'serving':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'served':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'no_show':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getStatusText = (status: Customer['status']): string => {
  switch (status) {
    case 'waiting':
      return 'Waiting';
    case 'serving':
      return 'Being Served';
    case 'served':
      return 'Served';
    case 'no_show':
      return 'No Show';
    default:
      return 'Unknown';
  }
};

export const sortCustomersByPriority = (customers: Customer[]): Customer[] => {
  return [...customers].sort((a, b) => {
    // First, filter to only waiting customers for queue position
    if (a.status !== 'waiting' && b.status !== 'waiting') {
      return 0; // Keep original order for non-waiting customers
    }
    if (a.status !== 'waiting') return 1;
    if (b.status !== 'waiting') return -1;
    
    // Priority customers first
    if (a.priority !== b.priority) {
      return a.priority === 'priority' ? -1 : 1;
    }
    // Then by join time (earliest first)
    return a.joinedAt.getTime() - b.joinedAt.getTime();
  });
};

export const getNextInQueue = (customers: Customer[]): Customer | null => {
  const waitingCustomers = customers.filter(c => c.status === 'waiting');
  const sorted = sortCustomersByPriority(waitingCustomers);
  return sorted.length > 0 ? sorted[0] : null;
};

export const calculateEstimatedWaitTime = (customers: Customer[], customerId: string, avgServiceTime: number = 15): number => {
  const waitingCustomers = customers.filter(c => c.status === 'waiting');
  const sorted = sortCustomersByPriority(waitingCustomers);
  const position = sorted.findIndex(c => c.id === customerId);
  
  if (position === -1) return 0;
  
  return position * avgServiceTime;
};
