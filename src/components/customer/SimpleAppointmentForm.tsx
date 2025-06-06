
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleAppointmentForm, CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';
import PersonalInfoSection from './appointment-form/PersonalInfoSection';
import LocationServiceSection from './appointment-form/LocationServiceSection';
import AppointmentPreferencesSection from './appointment-form/AppointmentPreferencesSection';
import VisitDetailsSection from './appointment-form/VisitDetailsSection';

interface SimpleAppointmentFormProps {
  onSubmit: (customerInfo: CustomerAppointmentData) => void;
}

const SimpleAppointmentForm = ({ onSubmit }: SimpleAppointmentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
