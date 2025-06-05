
import { useCallback } from 'react';
import { useUserQueries } from './useUserQueries';
import { useUserMutations } from './useUserMutations';
import { useUserFormState } from './useUserFormState';

export const useUserManagement = (userType: 'staff' | 'employee') => {
  const { users, locations, isLoading } = useUserQueries(userType);
  const { createUser, updateUser, deleteUser } = useUserMutations(userType);
  const {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    setFormData,
    resetForm,
    handleAddClick,
    handleEditClick,
  } = useUserFormState(userType);

  const handleDeleteClick = useCallback((id: string) => {
    if (confirm(`Are you sure you want to delete this ${userType}?`)) {
      deleteUser.mutate(id);
    }
  }, [deleteUser, userType]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateUser.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createUser.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  }, [formData, isEditing, createUser, updateUser, setIsDialogOpen, resetForm]);

  return {
    users,
    locations,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    isEditing,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
  };
};
