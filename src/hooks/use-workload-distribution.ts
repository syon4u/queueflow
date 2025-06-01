import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const mapStatusToUnionType = (status: string | null): 'available' | 'busy' | 'break' | 'offline' => {
  switch (status) {
    case 'available':
    case 'active':
      return 'available';
    case 'busy':
      return 'busy';
    case 'break':
      return 'break';
    case 'offline':
    case 'inactive':
      return 'offline';
    default:
      return 'offline';
  }
};

export const useWorkloadDistribution = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workloadData, setWorkloadData] = useState<WorkloadDistribution[]>([]);
  const [pendingRouting, setPendingRouting] = useState<CustomerRouting[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkloadData = async () => {
    setIsLoading(true);
    try {
      // Get all staff members and their current workload
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('id, first_name, last_name, status, location_id');

      if (staffError) throw staffError;

      const workloadPromises = (staff || []).map(async (member) => {
        // Get current appointments
        const { data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .eq('staff_id', member.id)
          .in('status', ['checked_in', 'in_progress', 'scheduled'])
          .gte('scheduled_time', new Date().toISOString());

        const currentLoad = appointments?.length || 0;
        const inProgress = appointments?.filter(a => a.status === 'in_progress').length || 0;
        const waitingCount = appointments?.filter(a => a.status === 'checked_in').length || 0;

        // Calculate next available time
        const nextSlot = appointments && appointments.length > 0
          ? new Date(Math.max(...appointments.map(a => new Date(a.scheduled_time).getTime())) + (30 * 60000))
          : new Date();

        return {
          staffId: member.id,
          name: `${member.first_name} ${member.last_name}`,
          currentLoad,
          capacity: 8, // Max appointments per staff per day
          utilization: Math.round((currentLoad / 8) * 100),
          specialties: ['General'], // Would come from staff profile
          nextAvailable: currentLoad < 3 ? new Date() : nextSlot,
          status: mapStatusToUnionType(member.status)
        };
      });

      const workload = await Promise.all(workloadPromises);
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

  const routeCustomer = (
    customerId: string,
    serviceType: string,
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

    const routing: CustomerRouting = {
      customerId,
      serviceType,
      priority,
      estimatedDuration,
      recommendedStaff,
      routingReason
    };

    return routing;
  };

  const assignCustomer = async (customerId: string, staffId: string): Promise<boolean> => {
    try {
      // Update appointment with assigned staff
      const { error } = await supabase
        .from('appointments')
        .update({ staff_id: staffId })
        .eq('customer_id', customerId)
        .eq('status', 'scheduled');

      if (error) throw error;

      // Refresh workload data
      await fetchWorkloadData();

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
      // Get unassigned appointments
      const { data: unassigned, error } = await supabase
        .from('appointments')
        .select('*')
        .is('staff_id', null)
        .eq('status', 'scheduled');

      if (error) throw error;

      if (!unassigned || unassigned.length === 0) {
        toast({
          title: 'No Rebalancing Needed',
          description: 'All appointments are already assigned'
        });
        return;
      }

      // Auto-assign based on workload distribution
      for (const appointment of unassigned) {
        const routing = routeCustomer(
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
    fetchWorkloadData();
  }, [user]);

  return {
    workloadData,
    pendingRouting,
    isLoading,
    routeCustomer,
    assignCustomer,
    balanceWorkload,
    refreshWorkload: fetchWorkloadData
  };
};
