
import React from 'react';
import { UserManagementTab } from '@/components/shared/UserManagementTab';

export const EmployeeTab: React.FC = () => {
  return (
    <UserManagementTab
      userType="employee"
      title="Employees"
      breadcrumbLabel="Employee Management"
    />
  );
};
