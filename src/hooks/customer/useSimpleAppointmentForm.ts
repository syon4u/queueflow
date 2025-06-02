
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocations } from '@/hooks/appointment-form/useLocations';

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

  // Use the existing useLocations hook for debugging
  const { data: locationsFromHook, error: locationsHookError, isLoading: locationsHookLoading } = useLocations();

  useEffect(() => {
    console.log('🧭 Location Data:', locationsFromHook);
    console.log('❗ Error:', locationsHookError);
  }, [locationsFromHook, locationsHookError]);

  // Fetch locations with improved error handling
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
        
        // Add a timeout to prevent hanging queries
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const { data, error, count } = await supabase
          .from('locations')
          .select('id, name, address', { count: 'exact' })
          .order('name')
          .abortSignal(controller.signal);
        
        clearTimeout(timeoutId);
        
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
        
        if (!data || data.length === 0) {
          console.warn('⚠️ No locations found in database');
          return [];
        }
        
        console.log('✅ Successfully fetched locations:', data.length);
        console.log('📋 Location details:', data);
        
        return data;
      } catch (err) {
        console.error('💥 Fetch error in try/catch:', err);
        
        // Return empty array instead of throwing to prevent app crash
        if (err instanceof Error && err.name === 'AbortError') {
          console.error('🕐 Query timed out');
          return [];
        }
        
        // For other errors, still return empty array but log the error
        console.error('🔥 Unexpected error:', err);
        return [];
      }
    },
    retry: 1, // Reduce retries to prevent getting stuck
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const { data, error } = await supabase
          .from('services')
          .select('id, name, duration, description')
          .eq('location_id', formData.locationId)
          .eq('is_active', true)
          .order('name')
          .abortSignal(controller.signal);
        
        clearTimeout(timeoutId);
        
        console.log('📊 Services query response:', { data, error });
        
        if (error) {
          console.error('❌ Services error:', error);
          return [];
        }
        
        console.log('✅ Fetched services:', data?.length || 0);
        return data || [];
      } catch (err) {
        console.error('💥 Services fetch error:', err);
        return [];
      }
    },
    enabled: !!formData.locationId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
