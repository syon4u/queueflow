
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, UserCheck, Plus, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from './DataTable';
import { StaffFormDialog } from './staff/StaffFormDialog';
import { useProfileManagement } from '@/hooks/admin/use-profile-management';
import { useStaffTableColumns } from './staff/StaffTableColumns';
import { useUserManagement } from '@/hooks/admin/use-user-management';
import { UsersTable } from './users/UsersTable';
import { UserSearchBox } from './users/UserSearchBox';
import { LoadingSpinner } from './users/LoadingSpinner';
import { ErrorAlert } from './users/ErrorAlert';
import Breadcrumb from '@/components/navigation/Breadcrumb';

export const MergedUsersTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('staff');

  // Staff management hooks
  const {
    staffMembers,
    locations,
    isLoading: staffLoading,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    isEditing,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit
  } = useProfileManagement();

  const staffColumns = useStaffTableColumns();

  // User roles management hooks
  const {
    users,
    isLoading: usersLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleRoleChange,
    addTemporaryData
  } = useUserManagement();

  // Show loading spinner only for the roles tab when it's active and loading
  if (usersLoading && activeTab === 'roles') {
    return <LoadingSpinner />;
  }

  // Show error only for the roles tab when it's active and has an error
  if (error && activeTab === 'roles') {
    return <ErrorAlert error={error} />;
  }

  // Calculate stats for header cards
  const staffStats = {
    total: staffMembers?.length || 0,
    active: staffMembers?.filter(s => s.status === 'active').length || 0,
    locations: new Set(staffMembers?.map(s => s.location_id)).size || 0
  };

  const userStats = {
    admin: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    customer: users.filter(u => u.role === 'customer').length
  };

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
          <p className="text-gray-600 mt-1">Manage staff members and user roles with live database integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <UserCheck className="h-3 w-3 mr-1" />
            System Operational
          </Badge>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{staffStats.total}</div>
            <p className="text-xs text-blue-600 mt-1">{staffStats.active} active members</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Locations</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{staffStats.locations}</div>
            <p className="text-xs text-green-600 mt-1">Service centers</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{userStats.admin}</div>
            <p className="text-xs text-purple-600 mt-1">Full access users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{users.length}</div>
            <p className="text-xs text-orange-600 mt-1">All role types</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage staff members and user roles with live database integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Staff Members
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                User Roles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Staff Members</h2>
                  <p className="text-sm text-gray-500">Manage staff profiles, roles, and location assignments</p>
                </div>
                <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
              
              <DataTable
                data={staffMembers || []}
                columns={staffColumns}
                isLoading={staffLoading}
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />

              <StaffFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleSubmit}
                isEditing={isEditing}
                locations={locations || []}
              />
            </TabsContent>

            <TabsContent value="roles" className="space-y-6 mt-6">
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
                isLoading={usersLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MergedUsersTab;
