
import React from 'react';
import { UserFormDialog } from '@/components/shared/UserFormDialog';

interface EmployeeFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  email: string;
  location_id?: string;
  status?: string;
}

interface Location {
  id: string;
  name: string;
}

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EmployeeFormData;
  onFormDataChange: (data: EmployeeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  locations: Location[];
}

export const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = (props) => {
  return (
    <UserFormDialog
      userType="employee"
      {...props}
    />
  );
};
