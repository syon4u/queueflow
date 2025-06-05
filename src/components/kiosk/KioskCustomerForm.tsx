
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User } from 'lucide-react';

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

interface KioskCustomerFormProps {
  onSubmit: (data: CustomerData) => void;
  onBack: () => void;
}

export const KioskCustomerForm: React.FC<KioskCustomerFormProps> = ({
  onSubmit,
  onBack,
}) => {
  const [formData, setFormData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<CustomerData>>({});

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h3 className="text-2xl font-bold text-gray-800">
          Enter Your Information
        </h3>
      </div>

      <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg">
        <User className="h-6 w-6 text-blue-600" />
        <p className="text-blue-800">
          Please provide your contact information to generate your service ticket.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-lg">
              First Name *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`text-lg p-4 ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-lg">
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`text-lg p-4 ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-lg">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`text-lg p-4 ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-lg">
            Email Address (Optional)
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`text-lg p-4 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="px-8 py-4 text-lg">
            Generate Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};
