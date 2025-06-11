
import { useState, useCallback } from 'react';
import { useLocations } from '@/hooks/appointment-form/useLocations';
import { useServices } from '@/hooks/appointment-form/useServices';

export interface CustomerAppointmentData {
  name: string;
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
    name: '',
    phone: '',
    email: '',
    locationId: '',
    serviceId: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: '',
    additionalNotes: '',
  });

  console.log('useSimpleAppointmentForm - Hook state:', {
    locationId: formData.locationId,
    serviceId: formData.serviceId
  });

  // Always call hooks in the same order
  const { data: locations, isLoading: locationsLoading, error: locationsError } = useLocations();
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices(formData.locationId || undefined);

  console.log('useSimpleAppointmentForm - Hook results:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError,
    formDataLocationId: formData.locationId
  });

  const updateField = useCallback((field: keyof CustomerAppointmentData, value: string) => {
    console.log('useSimpleAppointmentForm - Updating field:', field, 'with value:', value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Clear service when location changes
      if (field === 'locationId' && value !== prev.locationId) {
        newData.serviceId = '';
      }
      
      return newData;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      locationId: '',
      serviceId: '',
      preferredDate: '',
      preferredTime: '',
      reasonForVisit: '',
      additionalNotes: '',
    });
  }, []);

  const validateForm = useCallback((): string | null => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.locationId) return 'Please select a location';
    if (!formData.serviceId) return 'Please select a service';
    if (!formData.preferredDate) return 'Please select a preferred date';
    if (!formData.preferredTime) return 'Please select a preferred time';
    return null;
  }, [formData]);

  return {
    formData,
    updateField,
    resetForm,
    validateForm,
    locations: locations || [],
    locationsLoading,
    locationsError,
    services: services || [],
    servicesLoading,
    servicesError,
  };
};
