
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumb, { BreadcrumbItem } from '@/components/navigation/Breadcrumb';

interface AppointmentProgressCardProps {
  currentStep: number;
}

const AppointmentProgressCard: React.FC<AppointmentProgressCardProps> = ({ currentStep }) => {
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const steps = [
      { label: 'Location', step: 1 },
      { label: 'Service', step: 2 },
      { label: 'Date & Time', step: 3 },
      { label: 'Confirm', step: 4 }
    ];

    return steps.map(step => ({
      label: step.label,
      isActive: step.step === currentStep
    }));
  };

  return (
    <div className="mb-6">
      <Card className="bg-white/95 backdrop-blur-sm border-broward-teal/20 shadow-lg">
        <CardContent className="p-4">
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-broward-navy/70">
              Step {currentStep} of 4
            </span>
          </div>
          <Breadcrumb 
            items={getBreadcrumbItems()}
            showHome={false}
            className="justify-center"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentProgressCard;
