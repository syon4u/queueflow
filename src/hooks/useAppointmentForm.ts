
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useLocations } from './appointment-form/useLocations';
import { useServices } from './appointment-form/useServices';
import { useAppointmentCreation } from './appointment-form/useAppointmentCreation';
import { useFormState } from './appointment-form/useFormState';

// Re-export types for backward compatibility
export type { Location, Service } from './appointment-form/types';

export const useAppointmentForm = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Customer details state for anonymous users
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const {
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
    nextStep,
    prevStep
  } = useFormState();

  const { locations } = useLocations();
  const { services, servicesLoading, servicesError } = useServices(selectedLocationId);
  const { createAppointment, isSubmitting } = useAppointmentCreation();

  const handleSubmit = async () => {
    console.log('useAppointmentForm - Submitting appointment for anonymous user...');
    
    if (!selectedLocationId || !selectedServiceId || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields including your name and phone number',
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
      customerDetails: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail || undefined
      }
    };

    createAppointment(appointmentData);
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
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    locations,
    services,
    servicesLoading,
    servicesError,
    isSubmitting,
    nextStep,
    prevStep,
    handleSubmit,
  };
};
