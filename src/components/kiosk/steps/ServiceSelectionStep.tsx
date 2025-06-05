
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';

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

interface ServiceSelectionStepProps {
  selectedLocation: Location;
  services: Service[];
  isLoading: boolean;
  onServiceSelect: (service: Service) => void;
  onBack: () => void;
}

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  selectedLocation,
  services,
  isLoading,
  onServiceSelect,
  onBack
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Select Service</CardTitle>
        <p className="text-center text-muted-foreground">
          Location: <strong>{selectedLocation.name}</strong>
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading services...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {services?.map((service) => (
              <Button
                key={service.id}
                variant="outline"
                className="h-auto p-6 text-left justify-between w-full"
                onClick={() => onServiceSelect(service)}
              >
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">~{service.duration} minutes</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>
            ))}
            <Button variant="ghost" onClick={onBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Locations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
