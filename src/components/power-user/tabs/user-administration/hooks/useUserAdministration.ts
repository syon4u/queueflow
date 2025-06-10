
import { useState } from 'react';
import { useUserQueries } from './useUserQueries';
import { useUserMutations } from './useUserMutations';
import { UserAdministrationState, UserAdministrationUser } from '../types';

export const useUserAdministration = () => {
  const [state, setState] = useState<UserAdministrationState>({
    searchTerm: '',
    roleFilter: '',
    selectedUser: null
  });

  const { users, isLoading, error, refetch, roleStats } = useUserQueries();
  const { updateRoleMutation, deleteUserMutation } = useUserMutations();

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         user.first_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(state.searchTerm.toLowerCase());
    
    const matchesRole = !state.roleFilter || state.roleFilter === 'all' || user.role === state.roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const setSearchTerm = (searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));
  };

  const setRoleFilter = (roleFilter: string) => {
    setState(prev => ({ ...prev, roleFilter }));
  };

  const setSelectedUser = (selectedUser: UserAdministrationUser | null) => {
    setState(prev => ({ ...prev, selectedUser }));
  };

  const handleUpdateRole = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleCreateUser = () => {
    refetch();
  };

  const handleEditUser = (user: UserAdministrationUser) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  return {
    users: filteredUsers,
    isLoading,
    error,
    refetch,
    searchTerm: state.searchTerm,
    setSearchTerm,
    roleFilter: state.roleFilter,
    setRoleFilter,
    selectedUser: state.selectedUser,
    setSelectedUser,
    roleStats,
    updateRolePending: updateRoleMutation.isPending,
    handleUpdateRole,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser
  };
};
