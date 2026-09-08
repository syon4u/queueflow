
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ShieldIcon } from '@/components/ui/brand-icons';
import AppointmentStepContent from './AppointmentStepContent';
import { Location, Service } from '@/hooks/appointment-form/types';

interface AppointmentFormCardProps {
  currentStep: number;
  selectedLocationId: string;
  setSelectedLocationId: (value: string) => void;
  selectedServiceId: string;
  setSelectedServiceId: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  reasonForVisit: string;
  setReasonForVisit: (reason: string) => void;
  locations: Location[];
  services: Service[];
  servicesLoading: boolean;
  servicesError: string | null;
}

const AppointmentFormCard: React.FC<AppointmentFormCardProps> = (props) => {
  const { t } = useTranslation();
  const { currentStep } = props;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t('appointments.steps.location');
      case 2:
        return t('appointments.steps.service');
      case 3:
        return t('appointments.steps.dateTime');
      case 4:
        return t('appointments.steps.confirm');
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-brand-teal/20 shadow-lg mb-8">
      <CardHeader className="bg-gradient-to-r from-brand-teal to-brand-blue text-white">
        <div className="flex items-center gap-3">
          <ShieldIcon size={24} />
          <CardTitle className="text-xl">
            {getStepTitle()}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <AppointmentStepContent {...props} />
      </CardContent>
    </Card>
  );
};

export default AppointmentFormCard;
