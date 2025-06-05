
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProfileManagement } from '@/hooks/admin/use-profile-management';
import { useStaffTableColumns } from './staff/StaffTableColumns';
import { useUserManagement } from '@/hooks/admin/use-user-management';
import { LoadingSpinner } from './users/LoadingSpinner';
import { ErrorAlert } from './users/ErrorAlert';
import { UsersTabHeader } from './users/UsersTabHeader';
import { StatsOverviewCards } from './users/StatsOverviewCards';
import { StaffManagementSection } from './users/StaffManagementSection';
import { UserRoleManagementSection } from './users/UserRoleManagementSection';

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
      <UsersTabHeader />

      <StatsOverviewCards staffStats={staffStats} userStats={userStats} />

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

            <TabsContent value="staff">
              <StaffManagementSection
                staffMembers={staffMembers}
                staffColumns={staffColumns}
                staffLoading={staffLoading}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                locations={locations}
                handleAddClick={handleAddClick}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleSubmit={handleSubmit}
              />
            </TabsContent>

            <TabsContent value="roles">
              <UserRoleManagementSection
                users={users}
                usersLoading={usersLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleRoleChange={handleRoleChange}
                addTemporaryData={addTemporaryData}
                userStats={userStats}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MergedUsersTab;
