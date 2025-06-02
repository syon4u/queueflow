
import { useState, useCallback } from 'react';
import { EmployeeFormData } from './types';

export const useEmployeeFormState = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'staff',
    location_id: '',
  });

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      phone: '',
      role: 'staff',
      location_id: '',
    });
    setIsEditing(false);
  };

  const handleAddClick = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((member: any) => {
    setFormData({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      phone: member.phone || '',
      role: member.user_roles?.role || 'staff',
      location_id: member.location_id || '',
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  }, []);

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    setFormData,
    resetForm,
    handleAddClick,
    handleEditClick,
  };
};
