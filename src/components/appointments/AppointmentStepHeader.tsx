
import React from 'react';
import { LandmarkCourthouse } from '@/components/ui/brand-icons';
import { useTranslation } from 'react-i18next';

const AppointmentStepHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <LandmarkCourthouse size={80} className="text-primary" />
      </div>
      <h1 className="text-4xl font-bold text-brand-navy mb-2">
        {t('appointments.newAppointment')}
      </h1>
      <p className="text-lg text-brand-navy/80">
        Schedule your appointment in a few quick steps
      </p>
    </div>
  );
};

export default AppointmentStepHeader;
