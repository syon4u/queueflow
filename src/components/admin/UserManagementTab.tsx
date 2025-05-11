
import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserManagement } from '@/hooks/admin/use-user-management';
import { UsersTable } from './users/UsersTable';
import { UserSearchBox } from './users/UserSearchBox';

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
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
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
