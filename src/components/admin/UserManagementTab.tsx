
import React from 'react';
import { Shield, Users, Plus, UserCheck } from 'lucide-react';
import { useUserManagement } from '@/hooks/admin/use-user-management';
import { UsersTable } from './users/UsersTable';
import { UserSearchBox } from './users/UserSearchBox';
import { LoadingSpinner } from './users/LoadingSpinner';
import { ErrorAlert } from './users/ErrorAlert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Breadcrumb from '@/components/navigation/Breadcrumb';

export const UserManagementTab = () => {
  const {
    users,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleRoleChange,
    addTemporaryData
  } = useUserManagement();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  // Calculate stats for the header cards
  const adminCount = users.filter(u => u.role === 'admin').length;
  const staffCount = users.filter(u => u.role === 'staff').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  return (
    <div className="space-y-6">
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
          <p className="text-gray-600 mt-1">Manage user roles and permissions across the system</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <UserCheck className="h-3 w-3 mr-1" />
            {users.length} Total Users
          </Badge>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{adminCount}</div>
            <p className="text-xs text-red-600 mt-1">Full system access</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{staffCount}</div>
            <p className="text-xs text-blue-600 mt-1">Queue management access</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{customerCount}</div>
            <p className="text-xs text-green-600 mt-1">Appointment booking access</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Role Management
              </CardTitle>
              <CardDescription>
                Assign and manage user roles and permissions with live database updates
              </CardDescription>
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
