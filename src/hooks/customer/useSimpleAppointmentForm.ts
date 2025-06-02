import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  id: string;
  name: string;
  address?: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  description?: string;
}

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

  /** 
   * Fetch all active locations (no RLS blocking)
   */
  const {
    data: locations = [],
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery<Location[]>({
    queryKey: ['simple-locations'],
    queryFn: async (): Promise<Location[]> => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, address')
        .order('name');

      if (error) throw error;
      return data || [];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  /**
   * Fetch services once a location is selected
   */
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery<Service[]>({
    queryKey: ['simple-services', formData.locationId],
    queryFn: async (): Promise<Service[]> => {
      if (!formData.locationId) return [];

      const { data, error } = await supabase
        .from('services')
        .select('id, name, duration, description')
        .eq('location_id', formData.locationId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(formData.locationId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Update a single field in formData
  const updateField = (field: keyof CustomerAppointmentData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'locationId' && value !== prev.locationId) {
        updated.serviceId = '';
      }
      return updated;
    });
  };

  // Reset form back to initial state
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

  // Simple validation before submission
  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.locationId) return 'Please select a location';
    if (!formData.serviceId) return 'Please select a service';
    return null;
  };

  return {
    formData,
    updateField,
    resetForm,
    validateForm,

    locations,
    locationsLoading,
    locationsError: locationsError?.message ?? null,

    services,
    servicesLoading,
    servicesError: servicesError?.message ?? null,
  };
};