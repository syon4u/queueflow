
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';

interface PersonalInfoSectionProps {
  formData: CustomerAppointmentData;
  updateField: (field: keyof CustomerAppointmentData, value: string) => void;
}

const PersonalInfoSection = ({ formData, updateField }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
