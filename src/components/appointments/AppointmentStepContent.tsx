
import React from 'react';
import { useTranslation } from 'react-i18next';
import LocationStep from './LocationStep';
import ServiceStep from './ServiceStep';
import DateTimeStep from './DateTimeStep';
import ConfirmationStep from './ConfirmationStep';
import { Location, Service } from '@/hooks/appointment-form/types';

interface AppointmentStepContentProps {
  currentStep: number;
  selectedLocationId: string;
  setSelectedLocationId: (value: string) => void;
  selectedServiceId: string;
  setSelectedServiceId: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  reasonForVisit: string;
  setReasonForVisit: (reason: string) => void;
  locations: Location[];
  services: Service[];
  servicesLoading: boolean;
  servicesError: string | null;
}

const AppointmentStepContent: React.FC<AppointmentStepContentProps> = ({
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
  servicesError
}) => {
  const { t } = useTranslation();

  const getStepHeaderContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Choose Your Service Location',
          description: 'Select the Broward County office where you\'d like to receive service'
        };
      case 2:
        return {
          title: 'Select Your Service',
          description: 'Choose the type of service you need assistance with'
        };
      case 3:
        return {
          title: 'Pick Your Preferred Time',
          description: 'Select a date and time that works best for your schedule'
        };
      case 4:
        return {
          title: 'Confirm Your Appointment',
          description: 'Review your appointment details and add any additional notes'
        };
      default:
        return { title: '', description: '' };
    }
  };

  const stepHeader = getStepHeaderContent();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-broward-navy mb-2">
          {stepHeader.title}
        </h3>
        <p className="text-broward-navy/70">
          {stepHeader.description}
        </p>
      </div>

      {/* Step 1: Select Location */}
      {currentStep === 1 && (
        <LocationStep 
          locationId={selectedLocationId}
          onLocationChange={setSelectedLocationId}
        />
      )}
      
      {/* Step 2: Select Service */}
      {currentStep === 2 && (
        <ServiceStep 
          serviceId={selectedServiceId}
          onServiceChange={setSelectedServiceId}
          locationId={selectedLocationId}
          services={services}
          isLoading={servicesLoading}
          error={servicesError}
        />
      )}
      
      {/* Step 3: Select Date and Time */}
      {currentStep === 3 && (
        <DateTimeStep 
          date={selectedDate}
          onDateChange={setSelectedDate}
          time={selectedTime}
          onTimeChange={setSelectedTime}
        />
      )}
      
      {/* Step 4: Confirm Details */}
      {currentStep === 4 && (
        <ConfirmationStep 
          locations={locations}
          services={services}
          selectedLocationId={selectedLocationId}
          selectedServiceId={selectedServiceId}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          notes={notes}
          onNotesChange={setNotes}
          reasonForVisit={reasonForVisit}
          onReasonForVisitChange={setReasonForVisit}
        />
      )}
    </div>
  );
};

export default AppointmentStepContent;
