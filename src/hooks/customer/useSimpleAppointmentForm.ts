
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocations } from '@/hooks/appointment-form/useLocations';
import { useServices } from '@/hooks/appointment-form/useServices';

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
  const { t } = useTranslation();
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
    data: locations, 
    isLoading: locationsLoading, 
    error: locationsError 
  } = useLocations();

  const { 
    data: services, 
    isLoading: servicesLoading, 
    error: servicesError 
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
      return t('public.booking.validation.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      return t('public.booking.validation.lastNameRequired');
    }

    if (!formData.phone.trim()) {
      return t('public.booking.validation.phoneRequired');
    }

    if (!formData.locationId) {
      return t('public.booking.validation.locationRequired');
    }

    if (!formData.serviceId) {
      return t('public.booking.validation.serviceRequired');
    }

    if (!formData.preferredDate) {
      return t('public.booking.validation.dateRequired');
    }

    if (!formData.preferredTime) {
      return t('public.booking.validation.timeRequired');
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
