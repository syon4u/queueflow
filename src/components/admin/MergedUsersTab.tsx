
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProfileManagement } from '@/hooks/admin/use-profile-management';
import { useUserManagement } from '@/hooks/admin/use-user-management';
import { LoadingSpinner } from './users/LoadingSpinner';
import { ErrorAlert } from './users/ErrorAlert';
import { UserManagementHeader } from './users/UserManagementHeader';
import { UserManagementStats } from './users/UserManagementStats';
import { StaffManagementSection } from './users/StaffManagementSection';
import { UserRolesSection } from './users/UserRolesSection';

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
      <UserManagementHeader totalUsers={userStats.total} />
      
      <UserManagementStats staffStats={staffStats} userStats={userStats} />

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

            <TabsContent value="staff">
              <StaffManagementSection
                staffMembers={staffMembers}
                locations={locations}
                isLoading={staffLoading}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                handleAddClick={handleAddClick}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleSubmit={handleSubmit}
              />
            </TabsContent>

            <TabsContent value="roles">
              <UserRolesSection
                users={users}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleRoleChange={handleRoleChange}
                addTemporaryData={addTemporaryData}
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
