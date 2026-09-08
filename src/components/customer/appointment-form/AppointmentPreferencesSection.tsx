
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';

interface AppointmentPreferencesSectionProps {
  formData: CustomerAppointmentData;
  updateField: (field: keyof CustomerAppointmentData, value: string) => void;
}

const AppointmentPreferencesSection = ({ formData, updateField }: AppointmentPreferencesSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        {t('public.booking.preferences.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preferredDate">{t('public.booking.preferences.preferredDate')}</Label>
          <Input
            id="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredTime">{t('public.booking.preferences.preferredTime')}</Label>
          <Input
            id="preferredTime"
            type="time"
            value={formData.preferredTime}
            onChange={(e) => updateField('preferredTime', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentPreferencesSection;
