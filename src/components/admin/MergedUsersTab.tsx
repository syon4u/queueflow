
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, UserCheck, Plus, Building2, UserCog } from 'lucide-react';
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

  // Calculate comprehensive stats for header cards
  const staffStats = {
    total: staffMembers?.length || 0,
    active: staffMembers?.filter(s => s.status === 'active').length || 0,
    admin: staffMembers?.filter(s => s.role === 'admin').length || 0,
    staff: staffMembers?.filter(s => s.role === 'staff').length || 0,
    locations: locations?.length || 0
  };

  const userStats = {
    admin: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    customer: users.filter(u => u.role === 'customer').length,
    total: users.length
  };

  return (
    <div className="space-y-6">
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

      {/* Enhanced Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{staffStats.active}</div>
            <p className="text-xs text-blue-600 mt-1">of {staffStats.total} total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Staff Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{staffStats.admin}</div>
            <p className="text-xs text-purple-600 mt-1">Admin privileges</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Service Locations</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{staffStats.locations}</div>
            <p className="text-xs text-green-600 mt-1">Active centers</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">All Users</CardTitle>
            <UserCog className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{userStats.total}</div>
            <p className="text-xs text-orange-600 mt-1">System-wide</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-800">Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900">{userStats.customer}</div>
            <p className="text-xs text-teal-600 mt-1">Service users</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            Comprehensive User Management
          </CardTitle>
          <CardDescription>
            Manage staff profiles, user roles, permissions, and location assignments with live database integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Staff Profiles & Roles
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                User Role Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Staff Members & Role Assignments</h2>
                  <p className="text-sm text-gray-500">Manage staff profiles, role assignments, and location access permissions</p>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MergedUsersTab;
