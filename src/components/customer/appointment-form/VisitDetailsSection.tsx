
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';

interface VisitDetailsSectionProps {
  formData: CustomerAppointmentData;
  updateField: (field: keyof CustomerAppointmentData, value: string) => void;
}

const VisitDetailsSection = ({ formData, updateField }: VisitDetailsSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('public.booking.visit.title')}</h3>
      <div className="space-y-2">
        <Label htmlFor="reasonForVisit">{t('public.booking.visit.reason')}</Label>
        <Textarea
          id="reasonForVisit"
          value={formData.reasonForVisit}
          onChange={(e) => updateField('reasonForVisit', e.target.value)}
          placeholder={t('public.booking.visit.reasonPlaceholder')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">{t('public.booking.visit.notes')}</Label>
        <Textarea
          id="additionalNotes"
          value={formData.additionalNotes}
          onChange={(e) => updateField('additionalNotes', e.target.value)}
          placeholder={t('public.booking.visit.notesPlaceholder')}
          rows={3}
        />
      </div>
    </div>
  );
};

export default VisitDetailsSection;
