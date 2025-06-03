
import { supabase } from '@/integrations/supabase/client';
import { BreakRequest, StaffAvailability } from '@/types/break-management';

export const createBreakRequest = async (
  staffId: string,
  breakType: BreakRequest['breakType'],
  duration: number,
  availableStaff: StaffAvailability[],
  handoverStaffId?: string,
  reason?: string
): Promise<BreakRequest> => {
  // Check if auto-approval is possible
  const lowWorkload = availableStaff.some(s => s.canCover);
  const isShortBreak = breakType === 'short' && duration <= 15;
  const autoApproved = lowWorkload && isShortBreak;

  const breakRequest: Omit<BreakRequest, 'id'> = {
    staffId,
    breakType,
    duration,
    requestedTime: new Date(),
    status: autoApproved ? 'approved' : 'pending',
    handoverStaffId,
    reason,
    autoApproved
  };

  // In a real implementation, this would go to the database
  // For now, we'll simulate the process
  const newBreak: BreakRequest = {
    ...breakRequest,
    id: `break-${Date.now()}`
  };

  return newBreak;
};

export const startBreak = async (breakRequest: BreakRequest, userEmail?: string) => {
  // Update staff status in profiles table
  await supabase
    .from('profiles')
    .update({ 
      status: 'break'
    })
    .eq('id', breakRequest.staffId);

  // Create break request record
  await supabase
    .from('break_requests')
    .insert({
      staff_id: breakRequest.staffId,
      break_type: breakRequest.breakType,
      status: 'approved',
      requested_start: new Date().toISOString(),
      requested_end: new Date(Date.now() + breakRequest.duration * 60000).toISOString(),
      handover_staff_id: breakRequest.handoverStaffId,
      notes: breakRequest.reason
    });

  // Notify handover staff if applicable
  if (breakRequest.handoverStaffId) {
    await supabase
      .from('staff_notifications')
      .insert({
        staff_id: breakRequest.handoverStaffId,
        type: 'handover_request',
        message: `Please take over for ${userEmail} who is on a ${breakRequest.duration}-minute break`,
        status: 'unread'
      });
  }
};

export const endBreak = async (breakRequest: BreakRequest, userEmail?: string) => {
  // Update staff status in profiles table
  await supabase
    .from('profiles')
    .update({ 
      status: 'active'
    })
    .eq('id', breakRequest.staffId);

  // Update break request to completed
  await supabase
    .from('break_requests')
    .update({
      status: 'completed'
    })
    .eq('staff_id', breakRequest.staffId)
    .eq('status', 'approved');

  // Notify handover staff that break is over
  if (breakRequest.handoverStaffId) {
    await supabase
      .from('staff_notifications')
      .insert({
        staff_id: breakRequest.handoverStaffId,
        type: 'handover_complete',
        message: `${userEmail} has returned from break`,
        status: 'unread'
      });
  }
};

export const sendBreakApprovalRequest = async (supervisorId: string, userEmail?: string, duration?: number, breakType?: string) => {
  await supabase
    .from('staff_notifications')
    .insert({
      staff_id: supervisorId, // Would be determined by location/hierarchy
      type: 'break_request',
      message: `${userEmail} requested a ${duration}-minute ${breakType} break`,
      status: 'unread'
    });
};
