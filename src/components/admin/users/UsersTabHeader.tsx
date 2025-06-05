
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserCheck } from 'lucide-react';
import Breadcrumb from '@/components/navigation/Breadcrumb';

export const UsersTabHeader: React.FC = () => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'User & Staff Management', isActive: true }
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User & Staff Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive management of staff profiles, user roles, and permissions</p>
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
