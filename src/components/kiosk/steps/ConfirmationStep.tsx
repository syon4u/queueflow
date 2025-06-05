
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  current_capacity: number;
  max_capacity: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface ConfirmationStepProps {
  selectedLocation: Location;
  selectedService: Service;
  customerInfo: CustomerInfo;
  isLoading: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedLocation,
  selectedService,
  customerInfo,
  isLoading,
  onConfirm,
  onBack
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Confirm Your Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div><strong>Location:</strong> {selectedLocation.name}</div>
          <div><strong>Service:</strong> {selectedService.name}</div>
          <div><strong>Name:</strong> {customerInfo.name}</div>
          {customerInfo.phone && <div><strong>Phone:</strong> {customerInfo.phone}</div>}
          {customerInfo.email && <div><strong>Email:</strong> {customerInfo.email}</div>}
          <div><strong>Estimated Duration:</strong> {selectedService.duration} minutes</div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                Confirm & Get Ticket
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
