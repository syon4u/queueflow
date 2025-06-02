
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleAppointmentForm, CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Request an Appointment
        </CardTitle>
        <CardDescription>
          Fill out this form and we'll contact you to schedule your appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Location and Service Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location and Service
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                {locationsError && (
                  <p className="text-sm text-red-600">Error loading locations: {locationsError}</p>
                )}
                <Select 
                  value={formData.locationId} 
                  onValueChange={(value) => updateField('locationId', value)}
                  disabled={locationsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      locationsLoading 
                        ? "Loading locations..." 
                        : "Select a location"
                    } />
                    {locationsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                {servicesError && (
                  <p className="text-sm text-red-600">Error loading services: {servicesError}</p>
                )}
                <Select 
                  value={formData.serviceId} 
                  onValueChange={(value) => updateField('serviceId', value)}
                  disabled={!formData.locationId || servicesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !formData.locationId 
                        ? "Select a location first"
                        : servicesLoading 
                          ? "Loading services..."
                          : "Select a service"
                    } />
                    {servicesLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  </SelectTrigger>
                  <SelectContent>
                    {services?.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex flex-col">
                          <span>{service.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {service.duration} min
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Appointment Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => updateField('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => updateField('preferredTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Visit Details</h3>
            <div className="space-y-2">
              <Label htmlFor="reasonForVisit">Reason for Visit</Label>
              <Textarea
                id="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={(e) => updateField('reasonForVisit', e.target.value)}
                placeholder="Please describe the nature of your visit..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                placeholder="Any additional information or special requests..."
                rows={3}
              />
            </div>
          </div>

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
