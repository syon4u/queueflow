
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowRight } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  current_capacity: number;
  max_capacity: number;
}

interface LocationSelectionStepProps {
  locations: Location[];
  isLoading: boolean;
  onLocationSelect: (location: Location) => void;
}

export const LocationSelectionStep: React.FC<LocationSelectionStepProps> = ({
  locations,
  isLoading,
  onLocationSelect
}) => {
  const getCapacityColor = (current: number, max: number) => {
    const utilization = current / max;
    if (utilization < 0.7) return 'bg-green-100 text-green-800';
    if (utilization < 0.9) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Select Your Location</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading locations...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {locations?.map((location) => (
              <Button
                key={location.id}
                variant="outline"
                className="h-auto p-6 text-left justify-between"
                onClick={() => onLocationSelect(location)}
              >
                <div>
                  <h3 className="text-lg font-semibold">{location.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {location.current_capacity}/{location.max_capacity} capacity
                    </span>
                    <Badge className={getCapacityColor(location.current_capacity, location.max_capacity)}>
                      {Math.round((location.current_capacity / location.max_capacity) * 100)}% full
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
