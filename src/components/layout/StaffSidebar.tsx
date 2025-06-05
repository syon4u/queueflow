
import React from 'react';
import { UserSidebar } from '@/components/shared/UserSidebar';

interface StaffSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  notificationCount?: number;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = (props) => {
  return (
    <UserSidebar
      userType="staff"
      {...props}
    />
  );
};
