
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppointmentForm } from '@/hooks/useAppointmentForm';
import LocationStep from '@/components/appointments/LocationStep';
import ServiceStep from '@/components/appointments/ServiceStep';
import DateTimeStep from '@/components/appointments/DateTimeStep';
import ConfirmationStep from '@/components/appointments/ConfirmationStep';
import AppointmentStepper from '@/components/appointments/AppointmentStepper';
import AppointmentFormNavigation from '@/components/appointments/AppointmentFormNavigation';
import PageLayout from '@/components/layout/PageLayout';
import { LandmarkCourthouse, ShieldIcon } from '@/components/ui/broward-icons';

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
    handleSubmit,
    nextStep,
    prevStep
  } = useAppointmentForm();
  
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
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackNavigation}
              className="flex items-center gap-2 text-broward-navy hover:text-broward-teal"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </Button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LandmarkCourthouse size={80} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-broward-navy mb-2">
              {t('appointments.newAppointment')}
            </h1>
            <p className="text-lg text-broward-navy/80">
              Schedule your appointment with Broward County services
            </p>
          </div>

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

          {/* Help Section */}
          <div className="mt-8 text-center">
            <Card className="bg-broward-sand/20 border-broward-teal/30">
              <CardContent className="p-6">
                <h4 className="font-semibold text-broward-navy mb-2">Need Help?</h4>
                <p className="text-broward-navy/70 mb-4">
                  If you need assistance with scheduling your appointment, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <span>(954) 357-8000</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>info@broward.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NewAppointmentPage;
