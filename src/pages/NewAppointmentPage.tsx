
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppointmentForm } from '@/hooks/useAppointmentForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
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
    navigate('/customer');
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
          
          {/* Customer Details Form - Step 1 */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customerEmail">Email Address (Optional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Main Form Card - Steps 2-4 */}
          {currentStep > 1 && (
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
              services={services.map(service => ({
                ...service,
                description: service.description || ''
              }))}
              servicesLoading={servicesLoading}
              servicesError={servicesError}
            />
          )}
          
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
