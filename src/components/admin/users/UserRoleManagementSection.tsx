
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Plus } from 'lucide-react';
import { UsersTable } from './UsersTable';
import { UserSearchBox } from './UserSearchBox';

interface UserRoleManagementSectionProps {
  users: any[];
  usersLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleRoleChange: (userId: string, role: string) => void;
  addTemporaryData: () => void;
  userStats: {
    total: number;
  };
}

export const UserRoleManagementSection: React.FC<UserRoleManagementSectionProps> = ({
  users,
  usersLoading,
  searchQuery,
  setSearchQuery,
  handleRoleChange,
  addTemporaryData,
  userStats
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">System-Wide User Role Management</h2>
          <p className="text-sm text-gray-500">
            Assign and modify user permissions and access levels across the entire system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-500 flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-sm">{userStats.total} users</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addTemporaryData}
            className="border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Test Data
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <UserSearchBox 
          value={searchQuery} 
          onChange={setSearchQuery}
        />
      </div>

      <UsersTable 
        users={users} 
        onRoleChange={handleRoleChange}
        isLoading={usersLoading}
      />
    </div>
  );
};
