
import { useCallback } from 'react';
import { useUserQueries } from '../shared/useUserQueries';
import { useUserMutations } from '../shared/useUserMutations';
import { useUserFormState } from '../shared/useUserFormState';

// This hook now acts as a thin wrapper around the shared user management hooks
// Maintaining the same interface for backward compatibility
export const useProfileManagement = () => {
  const { users: staffMembers, locations, isLoading } = useUserQueries('staff');
  const { createUser, updateUser, deleteUser } = useUserMutations('staff');
  const {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    setFormData,
    resetForm,
    handleAddClick,
    handleEditClick,
  } = useUserFormState('staff');

  const handleDeleteClick = useCallback((staff: any) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteUser.mutate(staff.id);
    }
  }, [deleteUser]);

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
    staffMembers,
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
