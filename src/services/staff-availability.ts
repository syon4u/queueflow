
import { supabase } from '@/integrations/supabase/client';
import { StaffAvailability } from '@/types/break-management';
import { mapStatusToUnionType } from '@/utils/status-mapping';

export const checkStaffAvailability = async (currentUserId?: string): Promise<StaffAvailability[]> => {
  if (!currentUserId) return [];

  // Use user_profiles view to get staff with roles
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .neq('id', currentUserId)
    .in('role', ['staff', 'admin']);

  if (error) throw error;

  // Get current workload for each staff member
  const staffWithWorkload = await Promise.all(
    (profiles || []).map(async (s) => {
      const { data: workload } = await supabase
        .from('appointments')
        .select('id')
        .eq('staff_id', s.id)
        .in('status', ['checked_in', 'in_progress']);

      const mappedStatus = mapStatusToUnionType(s.status);

      return {
        staffId: s.id,
        name: `${s.first_name} ${s.last_name}`,
        currentWorkload: workload?.length || 0,
        status: mappedStatus,
        canCover: mappedStatus === 'available' && (workload?.length || 0) < 3
      };
    })
  );

  return staffWithWorkload;
};
