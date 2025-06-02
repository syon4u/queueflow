
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppointmentForm } from '@/hooks/useAppointmentForm';
import LocationStep from '@/components/appointments/LocationStep';
import ServiceStep from '@/components/appointments/ServiceStep';
import DateTimeStep from '@/components/appointments/DateTimeStep';
import ConfirmationStep from '@/components/appointments/ConfirmationStep';
import AppointmentStepper from '@/components/appointments/AppointmentStepper';
import AppointmentFormNavigation from '@/components/appointments/AppointmentFormNavigation';
import PageLayout from '@/components/layout/PageLayout';
import AppointmentPageHeader from '@/components/appointments/AppointmentPageHeader';
import AppointmentStepHeader from '@/components/appointments/AppointmentStepHeader';
import AppointmentProgressCard from '@/components/appointments/AppointmentProgressCard';
import AppointmentHelpSection from '@/components/appointments/AppointmentHelpSection';
import { ShieldIcon } from '@/components/ui/broward-icons';

const NewAppointmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = useAuth();
  
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
    servicesLoading,
    servicesError,
    handleSubmit,
    nextStep,
    prevStep
  } = useAppointmentForm();
  
  console.log('NewAppointmentPage - Form state:', {
    selectedLocationId,
    selectedServiceId,
    servicesCount: services.length,
    servicesLoading,
    servicesError,
    currentStep
  });
  
  const handleBackNavigation = () => {
    // Navigate back based on user role
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'staff') {
      navigate('/staff');
    } else {
      navigate('/customer');
    }
  };
  
  return (
    <PageLayout 
      headerTitle="Consumer Protection Division"
      headerSubtitle="Schedule your appointment with Broward County services"
    >
      <div className="min-h-screen bg-pattern-bubbles bg-gradient-overlay-blue">
        <div className="container mx-auto px-4 py-8">
          <AppointmentPageHeader onBackNavigation={handleBackNavigation} />
          <AppointmentStepHeader />
          <AppointmentProgressCard currentStep={currentStep} />

          {/* Progress Stepper */}
          <div className="mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border-broward-teal/20 shadow-lg">
              <CardContent className="p-6">
                <AppointmentStepper currentStep={currentStep} />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Form Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-broward-teal/20 shadow-lg mb-8">
            <CardHeader className="bg-gradient-to-r from-broward-teal to-broward-blue text-white">
              <div className="flex items-center gap-3">
                <ShieldIcon size={24} />
                <CardTitle className="text-xl">
                  {currentStep === 1 && t('appointments.steps.location')}
                  {currentStep === 2 && t('appointments.steps.service')}
                  {currentStep === 3 && t('appointments.steps.dateTime')}
                  {currentStep === 4 && t('appointments.steps.confirm')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 1: Select Location */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-broward-navy mb-2">
                      Choose Your Service Location
                    </h3>
                    <p className="text-broward-navy/70">
                      Select the Broward County office where you'd like to receive service
                    </p>
                  </div>
                  <LocationStep 
                    locationId={selectedLocationId}
                    onLocationChange={setSelectedLocationId}
                    locations={locations}
                  />
                </div>
              )}
              
              {/* Step 2: Select Service */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-broward-navy mb-2">
                      Select Your Service
                    </h3>
                    <p className="text-broward-navy/70">
                      Choose the type of service you need assistance with
                    </p>
                  </div>
                  <ServiceStep 
                    serviceId={selectedServiceId}
                    onServiceChange={setSelectedServiceId}
                    locationId={selectedLocationId}
                    services={services}
                    isLoading={servicesLoading}
                    error={servicesError}
                  />
                </div>
              )}
              
              {/* Step 3: Select Date and Time */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-broward-navy mb-2">
                      Pick Your Preferred Time
                    </h3>
                    <p className="text-broward-navy/70">
                      Select a date and time that works best for your schedule
                    </p>
                  </div>
                  <DateTimeStep 
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                    time={selectedTime}
                    onTimeChange={setSelectedTime}
                  />
                </div>
              )}
              
              {/* Step 4: Confirm Details */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-broward-navy mb-2">
                      Confirm Your Appointment
                    </h3>
                    <p className="text-broward-navy/70">
                      Review your appointment details and add any additional notes
                    </p>
                  </div>
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
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Navigation */}
          <Card className="bg-white/95 backdrop-blur-sm border-broward-teal/20 shadow-lg">
            <CardContent className="p-6">
              <AppointmentFormNavigation 
                currentStep={currentStep}
                onPrevStep={prevStep}
                onNextStep={nextStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>

          <AppointmentHelpSection />
        </div>
      </div>
    </PageLayout>
  );
};

export default NewAppointmentPage;
