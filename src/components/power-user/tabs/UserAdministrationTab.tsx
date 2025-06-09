
import React, { useState } from 'react';
import { useUserAdministration } from './user-administration/hooks/useUserAdministration';
import { UserAdministrationHeader } from './user-administration/UserAdministrationHeader';
import { UserRoleStatsCards } from './user-administration/UserRoleStatsCards';
import { UserManagementTable } from './user-administration/UserManagementTable';
import { UserAdministrationErrorState } from './user-administration/UserAdministrationErrorState';
import { UserAdministrationLoadingState } from './user-administration/UserAdministrationLoadingState';
import { UserCreateDialog } from './user-administration/UserCreateDialog';

export const UserAdministrationTab: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    users,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    selectedUser,
    setSelectedUser,
    roleStats,
    updateRolePending,
    handleUpdateRole,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser
  } = useUserAdministration();

  if (error) {
    return <UserAdministrationErrorState error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return <UserAdministrationLoadingState />;
  }

  const handleCreateUserClick = () => {
    setCreateDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <UserAdministrationHeader
        userCount={users.length}
        onRefresh={refetch}
        onCreateUser={handleCreateUserClick}
        isLoading={isLoading}
      />

      <UserRoleStatsCards roleStats={roleStats} />

      <UserManagementTable
        users={users}
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        selectedUser={selectedUser}
        updateRolePending={updateRolePending}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
        onUserSelect={setSelectedUser}
        onUpdateRole={handleUpdateRole}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <UserCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onUserCreated={refetch}
      />
    </div>
  );
};
