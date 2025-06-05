
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Phone, Mail, UserCheck } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-4xl mx-auto border border-blue-100">
      <div className="flex items-center gap-6 mb-8">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex items-center gap-3 px-6 py-3 text-lg border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            Enter Your Information
          </h3>
          <p className="text-xl text-gray-600">
            We need a few details to generate your service ticket
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <UserCheck className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-xl text-blue-800 font-medium">
          Please provide your contact information to generate your service ticket.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label htmlFor="firstName" className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <User className="h-5 w-5" />
              First Name *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`text-xl p-6 rounded-xl border-2 transition-all duration-200 ${
                errors.firstName 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-blue-300 focus:border-blue-500'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-lg font-medium">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="lastName" className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <User className="h-5 w-5" />
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`text-xl p-6 rounded-xl border-2 transition-all duration-200 ${
                errors.lastName 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-blue-300 focus:border-blue-500'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-lg font-medium">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="phone" className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`text-xl p-6 rounded-xl border-2 transition-all duration-200 ${
              errors.phone 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-blue-300 focus:border-blue-500'
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-500 text-lg font-medium">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Address (Optional)
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`text-xl p-6 rounded-xl border-2 transition-all duration-200 ${
              errors.email 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-blue-300 focus:border-blue-500'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-lg font-medium">{errors.email}</p>
          )}
        </div>

        <div className="flex justify-end pt-8">
          <Button 
            type="submit" 
            className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
          >
            Generate Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};
