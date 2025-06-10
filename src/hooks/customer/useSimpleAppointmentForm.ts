
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

  console.log('useSimpleAppointmentForm - Hook initialized');

  // Fetch locations - public access (no authentication required)
  const {
    data: locations = [],
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery<Location[]>({
    queryKey: ['public-locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('useSimpleAppointmentForm - Starting locations fetch...');
      
      try {
        console.log('useSimpleAppointmentForm - Making Supabase query for locations...');
        
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, address')
          .order('name');

        console.log('useSimpleAppointmentForm - Locations query completed:', { 
          data: data || [], 
          error: error || null,
          dataLength: data?.length || 0
        });

        if (error) {
          console.error('useSimpleAppointmentForm - Locations query error:', error);
          throw new Error(`Failed to load locations: ${error.message}`);
        }

        console.log('useSimpleAppointmentForm - Successfully returning locations:', data?.length || 0);
        return data || [];
      } catch (err) {
        console.error('useSimpleAppointmentForm - Exception in locations fetch:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch services - public access (no authentication required)
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery<Service[]>({
    queryKey: ['public-services', formData.locationId],
    queryFn: async (): Promise<Service[]> => {
      if (!formData.locationId) {
        console.log('useSimpleAppointmentForm - No location selected, skipping services fetch');
        return [];
      }

      console.log('useSimpleAppointmentForm - Starting services fetch for location:', formData.locationId);

      try {
        console.log('useSimpleAppointmentForm - Making Supabase query for services...');
        
        const { data, error } = await supabase
          .from('services')
          .select('id, name, duration, description')
          .eq('location_id', formData.locationId)
          .eq('is_active', true)
          .order('name');

        console.log('useSimpleAppointmentForm - Services query completed:', { 
          data: data || [], 
          error: error || null,
          dataLength: data?.length || 0,
          locationId: formData.locationId
        });

        if (error) {
          console.error('useSimpleAppointmentForm - Services query error:', error);
          throw new Error(`Failed to load services: ${error.message}`);
        }

        console.log('useSimpleAppointmentForm - Successfully returning services:', data?.length || 0);
        return data || [];
      } catch (err) {
        console.error('useSimpleAppointmentForm - Exception in services fetch:', err);
        throw err;
      }
    },
    enabled: Boolean(formData.locationId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  console.log('useSimpleAppointmentForm - Current state:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError: locationsError?.message || null,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError: servicesError?.message || null,
    selectedLocationId: formData.locationId
  });

  const updateField = (field: keyof CustomerAppointmentData, value: string) => {
    console.log('useSimpleAppointmentForm - Updating field:', field, 'to:', value);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'locationId' && value !== prev.locationId) {
        console.log('useSimpleAppointmentForm - Location changed, clearing service selection');
        updated.serviceId = '';
      }
      return updated;
    });
  };

  const resetForm = () => {
    console.log('useSimpleAppointmentForm - Resetting form');
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
    console.log('useSimpleAppointmentForm - Validating form:', formData);
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
