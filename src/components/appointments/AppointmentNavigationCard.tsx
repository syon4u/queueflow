
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AppointmentFormNavigation from './AppointmentFormNavigation';

interface AppointmentNavigationCardProps {
  currentStep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const AppointmentNavigationCard: React.FC<AppointmentNavigationCardProps> = ({
  currentStep,
  onPrevStep,
  onNextStep,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-brand-teal/20 shadow-lg">
      <CardContent className="p-6">
        <AppointmentFormNavigation 
          currentStep={currentStep}
          onPrevStep={onPrevStep}
          onNextStep={onNextStep}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default AppointmentNavigationCard;
