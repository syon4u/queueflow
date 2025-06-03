
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, UserCheck, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: 'Admin Dashboard', href: '/admin' },
            { label: 'User Management', isActive: true }
          ]}
          className="mb-4"
        />
      </div>

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
            <TabsList className="grid w-full grid-cols-2">
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
                <h2 className="text-lg font-semibold">Staff Members</h2>
                <Button onClick={handleAddClick}>
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
                  <h2 className="text-lg font-semibold">User Role Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Assign and manage user roles and permissions with live database updates
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-sm">{users.length} users</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addTemporaryData}
                    className="ml-4"
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
