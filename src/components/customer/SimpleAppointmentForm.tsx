
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
  /** Resolve false (or throw) when the booking was not created; the caller has already shown the reason. */
  onSubmit: (customerInfo: CustomerAppointmentData) => Promise<boolean | void> | boolean | void;
}

const SimpleAppointmentForm = ({ onSubmit }: SimpleAppointmentFormProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
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
    servicesError,
    formData
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('SimpleAppointmentForm - Form submitted:', formData);
    
    const validationError = validateForm();
    if (validationError) {
      console.log('SimpleAppointmentForm - Validation error:', validationError);
      toast({
        title: t('public.booking.toast.missingInfo'),
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    console.log('SimpleAppointmentForm - Calling onSubmit with:', formData);
    
    try {
      const created = await onSubmit(formData);
      if (created === false) {
        return;
      }
      toast({
        title: t('public.booking.toast.booked'),
        description: t('public.booking.toast.bookedDescription'),
      });

      resetForm();
    } catch (error) {
      console.error('SimpleAppointmentForm - Submission error:', error);
      toast({
        title: t('common.error'),
        description: t('public.booking.toast.submitError'),
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
            {t('public.booking.formTitle')}
          </CardTitle>
          <CardDescription className="text-left">
            {t('public.booking.loadingForm')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Spinner className="h-6 w-6" />
            <span className="ml-2 text-muted-foreground">{t('public.booking.loadingLocations')}</span>
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
            {t('public.booking.formTitle')}
          </CardTitle>
          <CardDescription className="text-left">
            {t('public.booking.loadFailed')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('public.booking.loadLocationsError', { error: locationsError })}
              <br />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                {t('public.booking.retry')}
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
            {t('public.booking.formTitle')}
          </CardTitle>
          <CardDescription className="text-left">
            {t('public.booking.noLocations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('public.booking.noLocationsMessage')}
              <br />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                {t('public.booking.refresh')}
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
          {t('public.booking.formTitle')}
        </CardTitle>
        <CardDescription className="text-left">
          {t('public.booking.formDescription')}
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

          <p className="text-sm text-muted-foreground text-center">
            <Trans
              i18nKey="public.booking.agreement"
              components={{
                terms: <Link to="/terms" className="underline underline-offset-4 text-foreground hover:text-primary" />,
                privacy: <Link to="/privacy" className="underline underline-offset-4 text-foreground hover:text-primary" />,
              }}
            />
          </p>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? t('public.booking.submitting') : t('public.booking.submit')}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            {t('public.booking.requiredNote')}
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleAppointmentForm;
