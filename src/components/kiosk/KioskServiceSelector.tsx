
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
}

interface KioskServiceSelectorProps {
  services: Service[];
  onServiceSelect: (serviceId: string) => void;
  onBack: () => void;
}

export const KioskServiceSelector: React.FC<KioskServiceSelectorProps> = ({
  services,
  onServiceSelect,
  onBack,
}) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h3 className="text-2xl font-bold text-gray-800">
          Select Service Type
        </h3>
      </div>
      
      {!services.length ? (
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-600 mb-2">
            No Services Available
          </h4>
          <p className="text-gray-500">
            No services are currently available at this location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Button
              key={service.id}
              variant="outline"
              onClick={() => onServiceSelect(service.id)}
              className="h-auto p-6 flex flex-col items-start text-left hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  {service.name}
                </h4>
                <div className="flex items-center gap-1 text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {formatDuration(service.duration)}
                  </span>
                </div>
              </div>
              {service.description && (
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
