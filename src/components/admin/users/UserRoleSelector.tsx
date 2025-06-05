
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserRoleSelectorProps {
  currentRole: string;
  userId: string;
  onRoleChange: (userId: string, role: string) => void;
  disabled?: boolean;
}

export const UserRoleSelector = ({ 
  currentRole, 
  userId, 
  onRoleChange,
  disabled = false
}: UserRoleSelectorProps) => {
  // Ensure currentRole is never an empty string
  const roleValue = (!currentRole || currentRole === '') ? 'customer' : currentRole;

  const handleValueChange = (value: string) => {
    console.log(`UserRoleSelector: Changing role for ${userId} from ${currentRole} to ${value}`);
    onRoleChange(userId, value);
  };

  return (
    <Select
      value={roleValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="customer">Customer</SelectItem>
        <SelectItem value="staff">Staff</SelectItem>
        <SelectItem value="power_user">Power User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};
