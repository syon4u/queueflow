
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  service: string;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'serving' | 'served' | 'no_show';
  joinedAt: Date;
  calledAt?: Date;
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

export interface QueueContextType {
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
