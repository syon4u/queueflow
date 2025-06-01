
import { WorkloadDistribution, CustomerRouting } from '@/types/workload-distribution';

export const routeCustomer = (
  customerId: string,
  serviceType: string,
  workloadData: WorkloadDistribution[],
  priority: CustomerRouting['priority'] = 'normal',
  estimatedDuration: number = 30
): CustomerRouting => {
  
  // Filter available staff
  const availableStaff = workloadData
    .filter(staff => 
      staff.status === 'available' && 
      staff.currentLoad < staff.capacity
    )
    .sort((a, b) => {
      // Prioritize by lowest utilization, then by next available time
      if (a.utilization !== b.utilization) {
        return a.utilization - b.utilization;
      }
      return (a.nextAvailable?.getTime() || 0) - (b.nextAvailable?.getTime() || 0);
    });

  let routingReason = '';
  let recommendedStaff: string[] = [];

  if (availableStaff.length === 0) {
    routingReason = 'No staff currently available - will be queued';
    recommendedStaff = workloadData
      .filter(s => s.status !== 'offline')
      .sort((a, b) => (a.nextAvailable?.getTime() || 0) - (b.nextAvailable?.getTime() || 0))
      .slice(0, 2)
      .map(s => s.staffId);
  } else {
    // Route based on priority and workload
    if (priority === 'urgent' || priority === 'high') {
      // For urgent cases, prefer staff with lowest current load
      recommendedStaff = availableStaff.slice(0, 2).map(s => s.staffId);
      routingReason = `Routed to least busy staff due to ${priority} priority`;
    } else {
      // For normal priority, balance workload
      recommendedStaff = availableStaff.slice(0, 3).map(s => s.staffId);
      routingReason = 'Routed for optimal workload distribution';
    }
  }

  return {
    customerId,
    serviceType,
    priority,
    estimatedDuration,
    recommendedStaff,
    routingReason
  };
};
