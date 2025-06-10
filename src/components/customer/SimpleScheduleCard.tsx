
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, FileText, AlertCircle } from 'lucide-react';
import { useSimpleAppointmentForm } from '@/hooks/customer/useSimpleAppointmentForm';
import PersonalInfoSection from './appointment-form/PersonalInfoSection';
import LocationServiceSection from './appointment-form/LocationServiceSection';
import AppointmentPreferencesSection from './appointment-form/AppointmentPreferencesSection';
import VisitDetailsSection from './appointment-form/VisitDetailsSection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateAppointmentTime, formatBusinessHoursMessage } from '@/utils/businessHours';

interface SimpleScheduleCardProps {
  onAppointmentRequested: (data: any) => void;
}

const SimpleScheduleCard: React.FC<SimpleScheduleCardProps> = ({ onAppointmentRequested }) => {
  const {
    formData,
    updateField,
    validateForm,
    locations,
    locationsLoading,
    services,
    servicesLoading,
    servicesError
  } = useSimpleAppointmentForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const validationError = validateForm();
    if (validationError) {
      return;
    }

    // Validate business hours if date and time are selected
    if (formData.preferredDate && formData.preferredTime) {
      const appointmentDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
      const timeValidation = validateAppointmentTime(appointmentDateTime);
      
      if (!timeValidation.isValid) {
        return; // Error will be shown in the form
      }
    }

    onAppointmentRequested(formData);
  };

  // Check if current selection is outside business hours
  const getBusinessHoursWarning = () => {
    if (!formData.preferredDate || !formData.preferredTime) return null;
    
    const appointmentDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
    const timeValidation = validateAppointmentTime(appointmentDateTime);
    
    if (!timeValidation.isValid) {
      return timeValidation.message;
    }
    
    return null;
  };

  const businessHoursWarning = getBusinessHoursWarning();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
          <Calendar className="h-6 w-6 text-blue-600" />
          <span>Schedule Your Appointment</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          {formatBusinessHoursMessage()} - Please select a time within business hours.
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Hours Warning */}
          {businessHoursWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {businessHoursWarning}
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Your Information</h3>
            </div>
            <PersonalInfoSection 
              formData={formData}
              updateField={updateField}
            />
          </div>

          {/* Location & Service Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Location & Service</h3>
            </div>
            <LocationServiceSection 
              formData={formData}
              updateField={updateField}
              locations={locations}
              locationsLoading={locationsLoading}
              services={services}
              servicesLoading={servicesLoading}
              servicesError={servicesError}
            />
          </div>

          {/* Appointment Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <Clock className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Preferred Date & Time</h3>
            </div>
            <AppointmentPreferencesSection 
              formData={formData}
              updateField={updateField}
            />
          </div>

          {/* Visit Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Visit Details</h3>
            </div>
            <VisitDetailsSection 
              formData={formData}
              updateField={updateField}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-colors"
              disabled={!!businessHoursWarning}
            >
              Request Appointment
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Your appointment request will be reviewed and confirmed within 24 hours
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleScheduleCard;
