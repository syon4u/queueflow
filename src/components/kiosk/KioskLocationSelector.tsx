
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

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
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-orange-100">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="h-12 w-12 text-orange-500" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          No Locations Available
        </h3>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          All service locations are currently closed. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-10 border border-blue-100">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MapPin className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-4xl font-bold text-gray-900 mb-3">
          Choose Your Service Location
        </h3>
        <p className="text-xl text-gray-600">
          Select the location where you'd like to receive service
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {locations.map((location) => (
          <Button
            key={location.id}
            variant="outline"
            onClick={() => onLocationSelect(location.id)}
            className="h-auto p-8 flex items-center justify-between text-left hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 rounded-xl group"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {location.name}
                </h4>
                {location.address && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {location.address}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors ml-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};
