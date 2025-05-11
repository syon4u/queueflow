
import React from 'react';
import { Shield } from 'lucide-react';
import { useUserManagement } from '@/hooks/admin/use-user-management';
import { UsersTable } from './users/UsersTable';
import { UserSearchBox } from './users/UserSearchBox';
import { LoadingSpinner } from './users/LoadingSpinner';
import { ErrorAlert } from './users/ErrorAlert';

export const UserManagementTab = () => {
  const {
    users,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleRoleChange
  } = useUserManagement();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Role Management</h2>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{users.length} users</span>
        </div>
      </div>

      <UserSearchBox 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />

      <UsersTable 
        users={users} 
        onRoleChange={handleRoleChange} 
      />
    </div>
  );
};

export default UserManagementTab;
