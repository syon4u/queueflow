
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AppointmentStepper from './AppointmentStepper';

interface AppointmentStepperCardProps {
  currentStep: number;
}

const AppointmentStepperCard: React.FC<AppointmentStepperCardProps> = ({ currentStep }) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-brand-teal/20 shadow-lg">
      <CardContent className="p-6">
        <AppointmentStepper currentStep={currentStep} />
      </CardContent>
    </Card>
  );
};

export default AppointmentStepperCard;
