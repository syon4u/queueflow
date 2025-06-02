
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister } from 'react-hook-form';
import { NewCustomerFormValues } from '../../../hooks/appointment-scheduling/types';

interface ReasonForVisitFieldProps {
  register: UseFormRegister<NewCustomerFormValues>;
}

const ReasonForVisitField: React.FC<ReasonForVisitFieldProps> = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="reason">Reason for Visit</Label>
      <Input
        id="reason"
        {...register('reason_for_visit')}
        placeholder="Brief description of your visit"
      />
    </div>
  );
};

export default ReasonForVisitField;
