
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';

interface VisitDetailsSectionProps {
  formData: CustomerAppointmentData;
  updateField: (field: keyof CustomerAppointmentData, value: string) => void;
}

const VisitDetailsSection = ({ formData, updateField }: VisitDetailsSectionProps) => {
  return (
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
  );
};

export default VisitDetailsSection;
