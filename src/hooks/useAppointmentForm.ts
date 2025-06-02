
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export interface Location {
  id: string;
  name: string;
  address?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  description?: string;
}

export const useAppointmentForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');

  console.log('useAppointmentForm - Current state:', {
    currentStep,
    selectedLocationId,
    selectedServiceId,
    selectedDate,
    selectedTime
  });

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      console.log('useAppointmentForm - Fetching locations...');
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, address')
        .order('name');
      
      if (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
      
      console.log('useAppointmentForm - Locations fetched:', data);
      return data || [];
    },
  });

  // Fetch services based on selected location
  const { 
    data: services = [], 
    isLoading: servicesLoading, 
    error: servicesError 
  } = useQuery({
    queryKey: ['services', selectedLocationId],
    queryFn: async () => {
      console.log('useAppointmentForm - Fetching services for location:', selectedLocationId);
      
      if (!selectedLocationId) {
        console.log('useAppointmentForm - No location selected, returning empty array');
        return [];
      }
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name, duration, description')
        .eq('location_id', selectedLocationId)
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('useAppointmentForm - Error fetching services:', error);
        throw error;
      }
      
      console.log('useAppointmentForm - Services fetched:', data);
      return data || [];
    },
    enabled: !!selectedLocationId,
  });

  // Clear service selection when location changes
  useEffect(() => {
    console.log('useAppointmentForm - Location changed, clearing service selection');
    setSelectedServiceId('');
  }, [selectedLocationId]);

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (appointmentData: any) => {
      console.log('useAppointmentForm - Creating appointment:', appointmentData);
      
      if (!user?.email) {
        throw new Error('User email not found');
      }

      // Check if customer exists
      let customerId;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const customerUuid = crypto.randomUUID();
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: customerUuid,
            first_name: user.user_metadata?.first_name || 'Customer',
            last_name: user.user_metadata?.last_name || 'User',
            email: user.email,
            phone: user.user_metadata?.phone
          });

        if (customerError) throw customerError;
        customerId = customerUuid;
      }

      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: appointmentData.service_id,
          location_id: appointmentData.location_id,
          scheduled_time: appointmentData.scheduled_time,
          reason_for_visit: appointmentData.reason_for_visit,
          notes: appointmentData.notes,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('useAppointmentForm - Appointment created successfully:', data);
      toast({
        title: t('common.success'),
        description: t('appointments.created'),
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      navigate('/customer');
    },
    onError: (error) => {
      console.error('useAppointmentForm - Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.createError'),
        variant: 'destructive',
      });
    },
  });

  const nextStep = () => {
    console.log('useAppointmentForm - Moving to next step from:', currentStep);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    console.log('useAppointmentForm - Moving to previous step from:', currentStep);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    console.log('useAppointmentForm - Submitting appointment...');
    
    if (!selectedLocationId || !selectedServiceId || !selectedDate || !selectedTime) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const scheduledDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    const appointmentData = {
      location_id: selectedLocationId,
      service_id: selectedServiceId,
      scheduled_time: scheduledDateTime.toISOString(),
      reason_for_visit: reasonForVisit,
      notes,
    };

    createAppointment.mutate(appointmentData);
  };

  return {
    currentStep,
    selectedLocationId,
    setSelectedLocationId,
    selectedServiceId,
    setSelectedServiceId,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    notes,
    setNotes,
    reasonForVisit,
    setReasonForVisit,
    locations,
    services,
    servicesLoading,
    servicesError: servicesError?.message || null,
    isSubmitting: createAppointment.isPending,
    nextStep,
    prevStep,
    handleSubmit,
  };
};
