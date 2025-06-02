
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppointmentForm } from '@/hooks/useAppointmentForm';
import PageLayout from '@/components/layout/PageLayout';
import AppointmentPageHeader from '@/components/appointments/AppointmentPageHeader';
import AppointmentStepHeader from '@/components/appointments/AppointmentStepHeader';
import AppointmentProgressCard from '@/components/appointments/AppointmentProgressCard';
import AppointmentStepperCard from '@/components/appointments/AppointmentStepperCard';
import AppointmentFormCard from '@/components/appointments/AppointmentFormCard';
import AppointmentNavigationCard from '@/components/appointments/AppointmentNavigationCard';
import AppointmentHelpSection from '@/components/appointments/AppointmentHelpSection';

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
            <AppointmentStepperCard currentStep={currentStep} />
          </div>
          
          {/* Main Form Card */}
          <AppointmentFormCard
            currentStep={currentStep}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            notes={notes}
            setNotes={setNotes}
            reasonForVisit={reasonForVisit}
            setReasonForVisit={setReasonForVisit}
            locations={locations}
            services={services}
            servicesLoading={servicesLoading}
            servicesError={servicesError}
          />
          
          {/* Navigation */}
          <AppointmentNavigationCard
            currentStep={currentStep}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <AppointmentHelpSection />
        </div>
      </div>
    </PageLayout>
  );
};

export default NewAppointmentPage;
