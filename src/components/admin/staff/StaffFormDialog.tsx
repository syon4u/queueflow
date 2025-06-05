
import React from 'react';
import { UserFormDialog } from '@/components/shared/UserFormDialog';

interface StaffFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  email: string;
  location_id?: string;
}

interface Location {
  id: string;
  name: string;
}

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StaffFormData;
  onFormDataChange: (data: StaffFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  locations: Location[];
}

export const StaffFormDialog: React.FC<StaffFormDialogProps> = (props) => {
  return (
    <UserFormDialog
      userType="staff"
      {...props}
    />
  );
};
