
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateUserFormData } from './types';

interface UserCreateFormProps {
  formData: CreateUserFormData;
  onFormDataChange: (data: Partial<CreateUserFormData>) => void;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({
  formData,
  onFormDataChange
}) => {
  const handleInputChange = (field: keyof CreateUserFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFormDataChange({ [field]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    onFormDataChange({ role: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={handleInputChange('phone')}
        />
      </div>
      
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="power_user">Power User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
