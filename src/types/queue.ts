
// Define the Customer type
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'serving' | 'served' | 'no-show';
  joinedAt: Date;
  estimatedWaitTime?: number;
  serviceId?: string;
}

// Define statistics type
export interface QueueStats {
  totalCustomers: number;
  waitingCustomers: number;
  servedCustomers: number;
  noShowCustomers: number;
  averageWaitTime: number;
}

// Define the context type
export interface QueueContextType {
  queueStatus: string;
  setQueueStatus: React.Dispatch<React.SetStateAction<string>>;
  locationId: string | null;
  currentQueueNumber: number | null;
  setCurrentQueueNumber: React.Dispatch<React.SetStateAction<number | null>>;
  waitingCount: number;
  setWaitingCount: React.Dispatch<React.SetStateAction<number>>;
  averageWaitTime: number | null;
  setAverageWaitTime: React.Dispatch<React.SetStateAction<number | null>>;
  customers: Customer[];
  currentCustomer: Customer | null;
  stats: QueueStats;
  addCustomer: (customerData: Omit<Customer, 'id' | 'status' | 'joinedAt'>) => void;
  callNextCustomer: () => void;
  markAsServed: () => void;
  markAsNoShow: () => void;
  resetQueue: () => void;
}
