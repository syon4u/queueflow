
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { NewCustomerFormValues } from './NewCustomerForm';

interface CustomerDetailsFieldsProps {
  register: UseFormRegister<NewCustomerFormValues>;
  errors: FieldErrors<NewCustomerFormValues>;
}

const CustomerDetailsFields: React.FC<CustomerDetailsFieldsProps> = ({
  register,
  errors
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter full name"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          {...register('phone', { required: 'Phone number is required' })}
          placeholder="Enter phone number"
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address (Optional)</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Enter email address"
        />
      </div>
    </div>
  );
};

export default CustomerDetailsFields;
