
import { useState } from 'react';
import { useLocations } from '@/hooks/appointment-form/useLocations';
import { useServices } from '@/hooks/appointment-form/useServices';
import type { LocationRow, ServiceRow } from '@/types/supabase';

export interface CustomerAppointmentData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  locationId: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  reasonForVisit: string;
  additionalNotes: string;
}

export const useSimpleAppointmentForm = () => {
  const [formData, setFormData] = useState<CustomerAppointmentData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    locationId: '',
    serviceId: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: '',
    additionalNotes: '',
  });

  // Use existing hooks with proper typing
  const { 
    locations, 
    isLoading: locationsLoading, 
    error: locationsError 
  } = useLocations();

  const { 
    services, 
    servicesLoading, 
    servicesError 
  } = useServices();

  const updateField = (field: keyof CustomerAppointmentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      locationId: '',
      serviceId: '',
      preferredDate: '',
      preferredTime: '',
      reasonForVisit: '',
      additionalNotes: '',
    });
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }

    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }

    if (!formData.phone.trim()) {
      return 'Phone number is required';
    }

    if (!formData.locationId) {
      return 'Location is required';
    }

    if (!formData.serviceId) {
      return 'Service is required';
    }

    if (!formData.preferredDate) {
      return 'Preferred date is required';
    }

    if (!formData.preferredTime) {
      return 'Preferred time is required';
    }

    return null;
  };

  return {
    formData,
    updateField,
    resetForm,
    validateForm,
    locations,
    services,
    locationsLoading,
    servicesLoading,
    locationsError,
    servicesError,
  };
};
