
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useSimpleAppointmentForm, CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';
import PersonalInfoSection from './appointment-form/PersonalInfoSection';
import LocationServiceSection from './appointment-form/LocationServiceSection';
import AppointmentPreferencesSection from './appointment-form/AppointmentPreferencesSection';
import VisitDetailsSection from './appointment-form/VisitDetailsSection';
import { Spinner } from '@/components/ui/spinner';

interface SimpleAppointmentFormProps {
  onSubmit: (customerInfo: CustomerAppointmentData) => void;
}

const SimpleAppointmentForm = ({ onSubmit }: SimpleAppointmentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log('SimpleAppointmentForm - Component rendering');
  
  const {
    formData,
    updateField,
    resetForm,
    validateForm,
    locations,
    locationsLoading,
    locationsError,
    services,
    servicesLoading,
    servicesError
  } = useSimpleAppointmentForm();

  console.log('SimpleAppointmentForm - Hook data:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'Missing Information',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast({
        title: 'Request Submitted!',
        description: 'We will contact you soon to confirm your appointment.',
      });
      
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was a problem submitting your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while locations are being fetched
  if (locationsLoading) {
    console.log('SimpleAppointmentForm - Showing loading state');
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-left">
          <CardTitle className="flex items-center gap-2 text-left">
            <User className="h-5 w-5" />
            Request an Appointment
          </CardTitle>
          <CardDescription className="text-left">
            Loading appointment form...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Spinner className="h-6 w-6" />
            <span className="ml-2 text-muted-foreground">Loading locations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state if locations failed to load
  if (locationsError) {
    console.log('SimpleAppointmentForm - Showing error state:', locationsError);
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-left">
          <CardTitle className="flex items-center gap-2 text-left">
            <User className="h-5 w-5" />
            Request an Appointment
          </CardTitle>
          <CardDescription className="text-left">
            Unable to load appointment form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load locations: {locationsError}
              <br />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show message if no locations are available
  if (!locations || locations.length === 0) {
    console.log('SimpleAppointmentForm - No locations available');
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-left">
          <CardTitle className="flex items-center gap-2 text-left">
            <User className="h-5 w-5" />
            Request an Appointment
          </CardTitle>
          <CardDescription className="text-left">
            No locations available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There are currently no locations available for scheduling appointments. 
              Please check back later or contact support.
              <br />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  console.log('SimpleAppointmentForm - Rendering full form');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-left">
        <CardTitle className="flex items-center gap-2 text-left">
          <User className="h-5 w-5" />
          Request an Appointment
        </CardTitle>
        <CardDescription className="text-left">
          Fill out this form and we'll contact you to schedule your appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoSection 
            formData={formData}
            updateField={updateField}
          />

          <LocationServiceSection 
            formData={formData}
            updateField={updateField}
            locations={locations}
            locationsLoading={locationsLoading}
            locationsError={locationsError}
            services={services}
            servicesLoading={servicesLoading}
            servicesError={servicesError}
          />

          <AppointmentPreferencesSection 
            formData={formData}
            updateField={updateField}
          />

          <VisitDetailsSection 
            formData={formData}
            updateField={updateField}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Appointment Request'}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            * Required fields. We will contact you within 1 business day to confirm your appointment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleAppointmentForm;
