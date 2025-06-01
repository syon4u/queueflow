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
    <div className="min-h-screen bg-pattern-bubbles bg-gradient-overlay-blue">
      <div className="container mx-auto p-6">
        <div className="bg-image bg-image-overlay rounded-xl mb-6" 
             style={{ backgroundImage: "url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg')" }}>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{t('appointments.newAppointment')}</h1>
            
            <AppointmentStepper currentStep={currentStep} />
          </div>
        </div>
        
        <Card className="mb-6 bg-white/90 backdrop-filter backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
        
        <AppointmentFormNavigation 
          currentStep={currentStep}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default NewAppointmentPage;