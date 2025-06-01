
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { WorkloadDistribution, CustomerRouting } from '@/types/workload-distribution';
import { fetchWorkloadData, assignCustomerToStaff, getUnassignedAppointments } from '@/services/workload-service';
import { routeCustomer } from '@/services/customer-routing';

export const useWorkloadDistribution = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workloadData, setWorkloadData] = useState<WorkloadDistribution[]>([]);
  const [pendingRouting, setPendingRouting] = useState<CustomerRouting[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWorkload = async () => {
    setIsLoading(true);
    try {
      const workload = await fetchWorkloadData();
      setWorkloadData(workload);
    } catch (error) {
      console.error('Error fetching workload data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load workload distribution data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomerRouting = (
    customerId: string,
    serviceType: string,
    priority: CustomerRouting['priority'] = 'normal',
    estimatedDuration: number = 30
  ): CustomerRouting => {
    return routeCustomer(customerId, serviceType, workloadData, priority, estimatedDuration);
  };

  const assignCustomer = async (customerId: string, staffId: string): Promise<boolean> => {
    try {
      await assignCustomerToStaff(customerId, staffId);
      
      // Refresh workload data
      await refreshWorkload();

      toast({
        title: 'Customer Assigned',
        description: 'Customer has been successfully assigned to staff member'
      });

      return true;
    } catch (error) {
      console.error('Error assigning customer:', error);
      toast({
        variant: 'destructive',
        title: 'Assignment Failed',
        description: 'Could not assign customer to staff member'
      });
      return false;
    }
  };

  const balanceWorkload = async (): Promise<void> => {
    try {
      const unassigned = await getUnassignedAppointments();

      if (unassigned.length === 0) {
        toast({
          title: 'No Rebalancing Needed',
          description: 'All appointments are already assigned'
        });
        return;
      }

      // Auto-assign based on workload distribution
      for (const appointment of unassigned) {
        const routing = createCustomerRouting(
          appointment.customer_id,
          appointment.service_id,
          'normal',
          30
        );

        if (routing.recommendedStaff.length > 0) {
          await assignCustomer(appointment.customer_id, routing.recommendedStaff[0]);
        }
      }

      toast({
        title: 'Workload Balanced',
        description: `Redistributed ${unassigned.length} appointments`
      });

    } catch (error) {
      console.error('Error balancing workload:', error);
      toast({
        variant: 'destructive',
        title: 'Balancing Failed',
        description: 'Could not balance workload automatically'
      });
    }
  };

  useEffect(() => {
    refreshWorkload();
  }, [user]);

  return {
    workloadData,
    pendingRouting,
    isLoading,
    routeCustomer: createCustomerRouting,
    assignCustomer,
    balanceWorkload,
    refreshWorkload
  };
};
