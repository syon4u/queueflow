
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import type { KioskStep } from '@/pages/KioskPage';

interface KioskHeaderProps {
  currentStep: KioskStep;
  onStartOver: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({ currentStep, onStartOver }) => {
  const getStepTitle = (step: KioskStep) => {
    switch (step) {
      case 'location': return 'Select Location';
      case 'service': return 'Choose Service';
      case 'customer': return 'Enter Information';
      case 'ticket': return 'Your Ticket';
      default: return 'QueueFlow Kiosk';
    }
  };

  const getStepNumber = (step: KioskStep) => {
    switch (step) {
      case 'location': return 1;
      case 'service': return 2;
      case 'customer': return 3;
      case 'ticket': return 4;
      default: return 1;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QueueFlow Kiosk</h1>
              <p className="text-gray-600">Self-Service Check-in</p>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center gap-2 text-lg px-6 py-3"
        >
          <Home className="h-5 w-5" />
          Start Over
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Step {getStepNumber(currentStep)}: {getStepTitle(currentStep)}
          </h2>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getStepNumber(currentStep) / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
