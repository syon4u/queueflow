
import React from 'react';
import { UserSidebar } from '@/components/shared/UserSidebar';

interface EmployeeSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  notificationCount?: number;
}

export const EmployeeSidebar: React.FC<EmployeeSidebarProps> = (props) => {
  return (
    <UserSidebar
      userType="employee"
      {...props}
    />
  );
};
