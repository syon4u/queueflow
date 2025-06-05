
import { useState } from 'react';

interface UserFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  email: string;
  location_id?: string;
}

export const useUserFormState = (userType: 'staff' | 'employee') => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'staff',
    email: '',
    location_id: ''
  });

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      phone: '',
      role: 'staff',
      email: '',
      location_id: ''
    });
  };

  const handleAddClick = () => {
    resetForm();
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditClick = (user: any) => {
    setFormData({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || '',
      role: (user.user_roles?.role || user.role) as 'admin' | 'staff' | 'customer',
      email: user.email || '',
      location_id: user.location_id || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    setFormData,
    resetForm,
    handleAddClick,
    handleEditClick
  };
};
