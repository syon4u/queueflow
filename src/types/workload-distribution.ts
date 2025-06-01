
export interface WorkloadDistribution {
  staffId: string;
  name: string;
  currentLoad: number;
  capacity: number;
  utilization: number;
  specialties: string[];
  nextAvailable: Date | null;
  status: 'available' | 'busy' | 'break' | 'offline';
}

export interface CustomerRouting {
  customerId: string;
  serviceType: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedDuration: number;
  recommendedStaff: string[];
  routingReason: string;
}
