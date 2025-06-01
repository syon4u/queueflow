
export interface BreakRequest {
  id: string;
  staffId: string;
  breakType: 'short' | 'lunch' | 'meeting' | 'training' | 'emergency';
  duration: number;
  requestedTime: Date;
  status: 'pending' | 'approved' | 'denied' | 'active' | 'completed';
  handoverStaffId?: string;
  reason?: string;
  autoApproved: boolean;
}

export interface StaffAvailability {
  staffId: string;
  name: string;
  currentWorkload: number;
  status: 'available' | 'busy' | 'break' | 'offline';
  canCover: boolean;
}
