
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
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
    const loadLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, address')
          .eq('is_active', true);

        if (error) throw error;
        setLocations(data || []);
        setLocationsError(null);
      } catch (error) {
        console.error('Error loading locations:', error);
        const errorMessage = 'Failed to load locations';
        setLocationsError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLocationsLoading(false);
      }
    };

    loadLocations();
  }, [toast]);

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, description, duration')
          .eq('is_active', true);

        if (error) throw error;
        setServices(data || []);
        setServicesError(null);
      } catch (error) {
        console.error('Error loading services:', error);
        const errorMessage = 'Failed to load services';
        setServicesError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, [toast]);

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

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'First name is required',
        variant: 'destructive',
      });
      return 'First name is required';
    }

    if (!formData.lastName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Last name is required',
        variant: 'destructive',
      });
      return 'Last name is required';
    }

    if (!formData.phone.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Phone number is required',
        variant: 'destructive',
      });
      return 'Phone number is required';
    }

    if (!formData.locationId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a location',
        variant: 'destructive',
      });
      return 'Location is required';
    }

    if (!formData.serviceId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a service',
        variant: 'destructive',
      });
      return 'Service is required';
    }

    if (!formData.preferredDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select a preferred date',
        variant: 'destructive',
      });
      return 'Preferred date is required';
    }

    if (!formData.preferredTime) {
      toast({
        title: 'Validation Error',
        description: 'Please select a preferred time',
        variant: 'destructive',
      });
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
