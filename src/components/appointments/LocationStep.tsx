
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocations } from '@/hooks/appointment-form/useLocations';

interface LocationStepProps {
  selectedLocationId: string;
  setSelectedLocationId: (locationId: string) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  selectedLocationId,
  setSelectedLocationId
}) => {
  const { data: locations, isLoading, error } = useLocations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading locations...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Error loading locations: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Location</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default LocationStep;
