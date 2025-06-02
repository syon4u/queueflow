
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDistribution } from '@/types/workload-distribution';
import { mapStatusToUnionType } from '@/utils/status-mapping';

export const fetchWorkloadData = async (): Promise<WorkloadDistribution[]> => {
  // Get all staff members and their current workload
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select(`
      id, 
      first_name, 
      last_name, 
      status, 
      location_id,
      user_roles!inner(role)
    `)
    .in('user_roles.role', ['staff', 'admin']);

  if (profileError) throw profileError;

  const workloadPromises = (profiles || []).map(async (member) => {
    // Get current appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('staff_id', member.id)
      .in('status', ['checked_in', 'in_progress', 'scheduled'])
      .gte('scheduled_time', new Date().toISOString());

    const currentLoad = appointments?.length || 0;
    
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
      specialties: ['General'], // Would come from profile data
      nextAvailable: currentLoad < 3 ? new Date() : nextSlot,
      status: mapStatusToUnionType(member.status)
    };
  });

  return Promise.all(workloadPromises);
};

export const assignCustomerToStaff = async (customerId: string, staffId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('appointments')
    .update({ staff_id: staffId })
    .eq('customer_id', customerId)
    .eq('status', 'scheduled');

  if (error) throw error;
  return true;
};

export const getUnassignedAppointments = async () => {
  const { data: unassigned, error } = await supabase
    .from('appointments')
    .select('*')
    .is('staff_id', null)
    .eq('status', 'scheduled');

  if (error) throw error;
  return unassigned || [];
};
