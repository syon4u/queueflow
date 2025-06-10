
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface Location {
  id: string;
  name: string;
  address: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
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

  const [locations, setLocations] = useState<Location[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Load locations
  useEffect(() => {
    let isMounted = true;
    
    const fetchLocations = async (): Promise<void> => {
      try {
        const response = await supabase
          .from('locations')
          .select('id, name, address')
          .eq('is_active', true);

        if (!isMounted) return;

        if (response.error) {
          throw response.error;
        }
        
        const locationData: Location[] = response.data || [];
        setLocations(locationData);
        setLocationsError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading locations:', err);
        setLocationsError('Failed to load locations');
      } finally {
        if (isMounted) {
          setLocationsLoading(false);
        }
      }
    };

    fetchLocations();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Load services
  useEffect(() => {
    let isMounted = true;
    
    const fetchServices = async (): Promise<void> => {
      try {
        const response = await supabase
          .from('services')
          .select('id, name, description, duration')
          .eq('is_active', true);

        if (!isMounted) return;

        if (response.error) {
          throw response.error;
        }
        
        const serviceData: Service[] = response.data || [];
        setServices(serviceData);
        setServicesError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading services:', err);
        setServicesError('Failed to load services');
      } finally {
        if (isMounted) {
          setServicesLoading(false);
        }
      }
    };

    fetchServices();
    
    return () => {
      isMounted = false;
    };
  }, []);

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
