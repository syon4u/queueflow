
import React from 'react';
import { Shield, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UsersTable } from './UsersTable';
import { UserSearchBox } from './UserSearchBox';

interface UserRolesSectionProps {
  users: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleRoleChange: (userId: string, role: string) => void;
  addTemporaryData: () => void;
  isLoading: boolean;
}

export const UserRolesSection: React.FC<UserRolesSectionProps> = ({
  users,
  searchQuery,
  setSearchQuery,
  handleRoleChange,
  addTemporaryData,
  isLoading
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User Role Management</h2>
          <p className="text-sm text-gray-500">
            Assign and manage user roles and permissions with live database updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-500 flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-sm">{users.length} users</span>
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
        isLoading={isLoading}
      />
    </div>
  );
};
