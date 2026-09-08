
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CheckIcon, DocumentIcon } from '@/components/ui/brand-icons';
import { Location, Service } from '@/hooks/useAppointmentForm';

interface ConfirmationStepProps {
  locations: Location[];
  services: Service[];
  selectedLocationId: string;
  selectedServiceId: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  reasonForVisit: string;
  onReasonForVisitChange: (reason: string) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  locations,
  services,
  selectedLocationId,
  selectedServiceId,
  selectedDate,
  selectedTime,
  notes,
  onNotesChange,
  reasonForVisit,
  onReasonForVisitChange
}) => {
  const { t } = useTranslation();
  
  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const selectedService = services.find(s => s.id === selectedServiceId);

  return (
    <div className="space-y-6">
      {/* Appointment Summary */}
      <Card className="border-brand-teal/30 bg-brand-sand/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckIcon size={20} className="text-brand-teal" />
            <CardTitle className="text-brand-navy">Appointment Summary</CardTitle>
          </div>
          <CardDescription>
            Please review your appointment details below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium text-brand-navy">Location</Label>
              <p className="text-brand-navy/80 bg-white p-3 rounded-md border">
                {selectedLocation?.name || 'Not selected'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium text-brand-navy">Service</Label>
              <p className="text-brand-navy/80 bg-white p-3 rounded-md border">
                {selectedService?.name || 'Not selected'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium text-brand-navy">Date</Label>
              <p className="text-brand-navy/80 bg-white p-3 rounded-md border">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM do, yyyy') : 'Not selected'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium text-brand-navy">Time</Label>
              <p className="text-brand-navy/80 bg-white p-3 rounded-md border">
                {selectedTime || 'Not selected'}
              </p>
            </div>
          </div>
          
          {selectedService?.duration && (
            <div className="space-y-2">
              <Label className="font-medium text-brand-navy">Estimated Duration</Label>
              <p className="text-brand-navy/80 bg-white p-3 rounded-md border">
                {selectedService.duration} minutes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="border-brand-teal/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DocumentIcon size={20} className="text-brand-teal" />
            <CardTitle className="text-brand-navy">Additional Information</CardTitle>
          </div>
          <CardDescription>
            Please provide any additional details about your visit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reason" className="font-medium text-brand-navy">
              {t('appointments.reasonForVisit')}
            </Label>
            <Input
              id="reason"
              placeholder={t('appointments.reasonPlaceholder')}
              value={reasonForVisit}
              onChange={(e) => onReasonForVisitChange(e.target.value)}
              className="border-brand-teal/30 focus:border-brand-teal"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium text-brand-navy">
              {t('appointments.notes')}
            </Label>
            <Textarea
              id="notes"
              placeholder={t('appointments.notesPlaceholder')}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={4}
              className="border-brand-teal/30 focus:border-brand-teal"
            />
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-brand-coral/30 bg-brand-coral/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-coral mt-2 flex-shrink-0"></div>
            <div className="space-y-2">
              <h4 className="font-semibold text-brand-navy">Important Notice</h4>
              <ul className="text-sm text-brand-navy/80 space-y-1">
                <li>• Please arrive 15 minutes before your scheduled appointment</li>
                <li>• Bring a valid photo ID and any required documentation</li>
                <li>• You will receive a confirmation email with your appointment details</li>
                <li>• If you need to reschedule, please do so at least 24 hours in advance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;
