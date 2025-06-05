
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import type { KioskStep } from './types';

interface KioskHeaderProps {
  currentStep: KioskStep;
  onStartOver: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({ currentStep, onStartOver }) => {
  const getStepTitle = (step: KioskStep) => {
    switch (step) {
      case 'location': return 'Select Location';
      case 'service': return 'Choose Service';
      case 'customer_info': return 'Enter Information';
      case 'ticket': return 'Your Ticket';
      default: return 'QueueFlow Kiosk';
    }
  };

  const getStepNumber = (step: KioskStep) => {
    switch (step) {
      case 'location': return 1;
      case 'service': return 2;
      case 'customer_info': return 3;
      case 'ticket': return 4;
      default: return 1;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">QueueFlow Kiosk</h1>
              <p className="text-lg text-blue-600 font-medium">Self-Service Check-in</p>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center gap-3 text-xl px-8 py-4 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <Home className="h-6 w-6" />
          Start Over
        </Button>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Step {getStepNumber(currentStep)}: {getStepTitle(currentStep)}
          </h2>
          <div className="text-lg text-gray-500 font-medium">
            {getStepNumber(currentStep)} of 4
          </div>
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${(getStepNumber(currentStep) / 4) * 100}%` }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
                step <= getStepNumber(currentStep)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
