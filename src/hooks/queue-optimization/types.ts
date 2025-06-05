
export interface QueueOptimizationRule {
  id: string;
  name: string;
  type: 'priority' | 'time' | 'service' | 'staff_efficiency';
  weight: number;
  isActive: boolean;
  condition: string;
  action: 'reorder' | 'expedite' | 'delay' | 'reassign';
}

export interface OptimizationResult {
  originalPosition: number;
  newPosition: number;
  reason: string;
  estimatedTimeReduction: number;
}

export interface QueueMetrics {
  averageWaitTime: number;
  totalCustomers: number;
  staffUtilization: number;
  completionRate: number;
  customerSatisfaction: number;
}

export interface OptimizationRecommendation {
  appointmentId: string;
  currentPosition: number;
  recommendedPosition: number;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  estimatedSavings: {
    timeMinutes: number;
    customerCount: number;
  };
}
