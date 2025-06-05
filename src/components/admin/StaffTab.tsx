
import React from 'react';
import { UserManagementTab } from '@/components/shared/UserManagementTab';

export const StaffTab: React.FC = () => {
  return (
    <UserManagementTab
      userType="staff"
      title="Staff Members"
      breadcrumbLabel="Staff Management"
    />
  );
};
