
import React from 'react';
import { Shield, Users } from 'lucide-react';
import { useUserManagement } from '@/hooks/admin/use-user-management';
import { UsersTable } from './users/UsersTable';
import { UserSearchBox } from './users/UserSearchBox';
import { LoadingSpinner } from './users/LoadingSpinner';
import { ErrorAlert } from './users/ErrorAlert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Role Management
              </CardTitle>
              <CardDescription>
                Assign and manage user roles and permissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="text-sm">{users.length} users</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <UserSearchBox 
              value={searchQuery} 
              onChange={setSearchQuery}
            />
          </div>

          <UsersTable 
            users={users} 
            onRoleChange={handleRoleChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
