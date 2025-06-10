
import React, { useState } from 'react';
import { UserAdministrationHeader } from './user-administration/UserAdministrationHeader';
import { UserSearchFilters } from './user-administration/UserSearchFilters';
import { UserRoleStatsCards } from './user-administration/UserRoleStatsCards';
import { UserManagementTable } from './user-administration/UserManagementTable';
import { UserCreateDialog } from './user-administration/UserCreateDialog';
import { UserAdministrationLoadingState } from './user-administration/UserAdministrationLoadingState';
import { UserAdministrationErrorState } from './user-administration/UserAdministrationErrorState';
import { useUserAdministration } from './user-administration/hooks/useUserAdministration';

export const UserAdministrationTab: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const {
    users,
    isLoading,
    error,
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
    handleDeleteUser,
    refetch
  } = useUserAdministration();

  if (isLoading) {
    return <UserAdministrationLoadingState />;
  }

  if (error) {
    return <UserAdministrationErrorState error={error} onRetry={refetch} />;
  }

  const handleCreateUserSuccess = () => {
    handleCreateUser();
    setCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <UserAdministrationHeader 
        userCount={users.length}
        onRefresh={refetch}
        onCreateUser={() => setCreateDialogOpen(true)}
        isLoading={isLoading}
      />
      
      <UserSearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />
      
      <UserRoleStatsCards roleStats={roleStats} />
      
      <UserManagementTable
        users={users}
        selectedUserId={selectedUser?.id || null}
        onSelectUser={(userId) => {
          const user = users.find(u => u.id === userId);
          setSelectedUser(user || null);
        }}
        onEditUser={(userId) => {
          const user = users.find(u => u.id === userId);
          if (user) handleEditUser(user);
        }}
        onUpdateRole={handleUpdateRole}
        onDeleteUser={handleDeleteUser}
        isUpdatingRole={updateRolePending}
      />
      
      <UserCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onUserCreated={handleCreateUserSuccess}
      />
    </div>
  );
};
