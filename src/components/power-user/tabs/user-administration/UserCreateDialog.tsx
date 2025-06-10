
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserCreateForm } from './create-user/UserCreateForm';
import { useCreateUser } from './create-user/useCreateUser';
import { UserCreateDialogProps, CreateUserFormData } from './create-user/types';

export const UserCreateDialog: React.FC<UserCreateDialogProps> = ({
  open,
  onOpenChange,
  onUserCreated
}) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'customer'
  });

  const { createUser, isLoading } = useCreateUser();

  const handleFormDataChange = (data: Partial<CreateUserFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createUser(formData);
    if (success) {
      onUserCreated();
      onOpenChange(false);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'customer'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <UserCreateForm 
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
