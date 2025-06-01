import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useAppointmentForm } from '@/hooks/useAppointmentForm';
import LocationStep from '@/components/appointments/LocationStep';
import ServiceStep from '@/components/appointments/ServiceStep';
import DateTimeStep from '@/components/appointments/DateTimeStep';
import ConfirmationStep from '@/components/appointments/ConfirmationStep';
import AppointmentStepper from '@/components/appointments/AppointmentStepper';
import AppointmentFormNavigation from '@/components/appointments/AppointmentFormNavigation';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardCard from '@/components/ui/broward-card';

const NewAppointmentPage = () => {
  const { t } = useTranslation();
  const {
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
    isSubmitting,
    currentStep,
    locations,
    services,
    handleSubmit,
    nextStep,
    prevStep
  } = useAppointmentForm();
  
  return (
    <BrowardLayout headerTitle="Schedule Appointment">
      <BrowardHero 
        title="Schedule a New Appointment" 
        subtitle="Complete the form to book your appointment"
        backgroundStyle="pattern"
      />
      
      <div className="container mx-auto p-6">
        <BrowardCard elevation="md">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-bc-navy dark:text-bc-blue mb-2">{t('appointments.steps.title')}</h2>
            <p className="text-neutral-600 dark:text-neutral-400">{t('appointments.steps.description')}</p>
            
            <AppointmentStepper currentStep={currentStep} />
          </div>
          
          <div className="p-4">
            {/* Step 1: Select Location */}
            {currentStep === 1 && (
              <LocationStep 
                locationId={selectedLocationId}
                onLocationChange={setSelectedLocationId}
                locations={locations}
              />
            )}
            
            {/* Step 2: Select Service */}
            {currentStep === 2 && (
              <ServiceStep 
                serviceId={selectedServiceId}
                onServiceChange={setSelectedServiceId}
                locationId={selectedLocationId}
                services={services}
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
          
          <div className="mt-6">
            <AppointmentFormNavigation 
              currentStep={currentStep}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </BrowardCard>
      </div>
    </BrowardLayout>
  );
};

export default NewAppointmentPage;