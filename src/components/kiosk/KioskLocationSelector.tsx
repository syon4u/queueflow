
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string | null;
}

interface KioskLocationSelectorProps {
  locations: Location[];
  onLocationSelect: (locationId: string) => void;
}

export const KioskLocationSelector: React.FC<KioskLocationSelectorProps> = ({
  locations,
  onLocationSelect,
}) => {
  if (!locations.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Locations Available
        </h3>
        <p className="text-gray-500">
          All service locations are currently closed. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Choose Your Service Location
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <Button
            key={location.id}
            variant="outline"
            onClick={() => onLocationSelect(location.id)}
            className="h-auto p-6 flex flex-col items-start text-left hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-800">
                {location.name}
              </h4>
            </div>
            {location.address && (
              <p className="text-gray-600 text-sm">
                {location.address}
              </p>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
