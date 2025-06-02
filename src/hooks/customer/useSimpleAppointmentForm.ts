
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
    additionalNotes: ''
  });

  // Fetch locations
  const { 
    data: locations = [], 
    isLoading: locationsLoading, 
    error: locationsError 
  } = useQuery({
    queryKey: ['simple-locations'],
    queryFn: async (): Promise<Location[]> => {
      console.log('🟢 Starting location fetch for simple appointment form...');
      
      try {
        console.log('🔄 Making Supabase query to locations table...');
        
        const { data, error, count } = await supabase
          .from('locations')
          .select('id, name, address', { count: 'exact' })
          .order('name');
        
        console.log('📊 Raw Supabase response:', { 
          data, 
          error, 
          count,
          dataLength: data?.length 
        });
        
        if (error) {
          console.error('❌ Supabase error:', error);
          throw new Error(`Failed to load locations: ${error.message}`);
        }
        
        if (!data) {
          console.warn('⚠️ No data returned from locations query');
          return [];
        }
        
        console.log('✅ Successfully fetched locations:', data.length);
        console.log('📋 Location details:', data);
        
        return data || [];
      } catch (err) {
        console.error('💥 Fetch error in try/catch:', err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch services based on selected location
  const { 
    data: services = [], 
    isLoading: servicesLoading, 
    error: servicesError 
  } = useQuery({
    queryKey: ['simple-services', formData.locationId],
    queryFn: async (): Promise<Service[]> => {
      if (!formData.locationId) {
        console.log('🔍 No location selected for services query');
        return [];
      }
      
      console.log('🟢 Fetching services for location:', formData.locationId);
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, duration, description')
          .eq('location_id', formData.locationId)
          .eq('is_active', true)
          .order('name');
        
        console.log('📊 Services query response:', { data, error });
        
        if (error) {
          console.error('❌ Services error:', error);
          throw new Error(`Failed to load services: ${error.message}`);
        }
        
        console.log('✅ Fetched services:', data?.length || 0);
        return data || [];
      } catch (err) {
        console.error('💥 Services fetch error:', err);
        throw err;
      }
    },
    enabled: !!formData.locationId,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  console.log('🎯 Hook state summary:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError: locationsError?.message || null,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError: servicesError?.message || null,
    formLocationId: formData.locationId
  });

  const updateField = (field: keyof CustomerAppointmentData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Clear service selection when location changes
      if (field === 'locationId' && value !== prev.locationId) {
        updated.serviceId = '';
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
      additionalNotes: ''
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
    locationsError: locationsError?.message || null,
    services,
    servicesLoading,
    servicesError: servicesError?.message || null,
  };
};
