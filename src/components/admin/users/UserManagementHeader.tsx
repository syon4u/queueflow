
import React from 'react';
import { UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Breadcrumb from '@/components/navigation/Breadcrumb';

interface UserManagementHeaderProps {
  totalUsers: number;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ totalUsers }) => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'User Management', isActive: true }
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage staff members and user roles with live database integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <UserCheck className="h-3 w-3 mr-1" />
            System Operational
          </Badge>
        </div>
      </div>
    </>
  );
};
