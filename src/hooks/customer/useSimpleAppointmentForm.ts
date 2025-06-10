
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

  // Fetch locations - now public access
  const {
    data: locations = [],
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery<Location[]>({
    queryKey: ['public-locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('Fetching locations for public access...');
      
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, address')
          .order('name');

        if (error) {
          console.error('Error fetching locations:', error);
          throw new Error(`Failed to load locations: ${error.message}`);
        }

        console.log('Successfully fetched locations:', data?.length || 0);
        return data || [];
      } catch (err) {
        console.error('Exception fetching locations:', err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch services - now public access
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery<Service[]>({
    queryKey: ['public-services', formData.locationId],
    queryFn: async (): Promise<Service[]> => {
      if (!formData.locationId) {
        console.log('No location selected, skipping services fetch');
        return [];
      }

      console.log('Fetching services for location:', formData.locationId);

      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, duration, description')
          .eq('location_id', formData.locationId)
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.error('Error fetching services:', error);
          throw new Error(`Failed to load services: ${error.message}`);
        }

        console.log('Successfully fetched services:', data?.length || 0);
        return data || [];
      } catch (err) {
        console.error('Exception fetching services:', err);
        throw err;
      }
    },
    enabled: Boolean(formData.locationId),
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateField = (field: keyof CustomerAppointmentData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'locationId' && value !== prev.locationId) {
        updated.serviceId = ''; // Clear service when location changes
      }
      return updated;
    });
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
