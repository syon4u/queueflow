
import { useCallback } from 'react';
import { useEmployeeQueries } from './employee-management/useEmployeeQueries';
import { useEmployeeMutations } from './employee-management/useEmployeeMutations';
import { useEmployeeFormState } from './employee-management/useEmployeeFormState';

export const useEmployeeManagement = () => {
  const { staffMembers, locations, isLoading } = useEmployeeQueries();
  const { createStaffMember, updateStaffMember, deleteStaffMember } = useEmployeeMutations();
  const {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    setFormData,
    resetForm,
    handleAddClick,
    handleEditClick,
  } = useEmployeeFormState();

  const handleDeleteClick = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteStaffMember.mutate(id);
    }
  }, [deleteStaffMember]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateStaffMember.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createStaffMember.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  }, [formData, isEditing, createStaffMember, updateStaffMember, setIsDialogOpen, resetForm]);

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
