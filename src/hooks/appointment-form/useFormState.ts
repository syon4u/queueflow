
import { useState, useEffect } from 'react';

export const useFormState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');

  console.log('useFormState - Current state:', {
    currentStep,
    selectedLocationId,
    selectedServiceId,
    selectedDate,
    selectedTime
  });

  // Clear service selection when location changes
  useEffect(() => {
    console.log('useFormState - Location changed, clearing service selection');
    setSelectedServiceId('');
  }, [selectedLocationId]);

  const nextStep = () => {
    console.log('useFormState - Moving to next step from:', currentStep);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    console.log('useFormState - Moving to previous step from:', currentStep);
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
    nextStep,
    prevStep
  };
};
