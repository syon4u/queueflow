
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText, ChevronRight } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-xl p-10 border border-blue-100">
      <div className="flex items-center gap-6 mb-8">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex items-center gap-3 px-6 py-3 text-lg border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            Select Service Type
          </h3>
          <p className="text-xl text-gray-600">
            Choose the service you need today
          </p>
        </div>
      </div>
      
      {!services.length ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h4 className="text-3xl font-bold text-gray-600 mb-4">
            No Services Available
          </h4>
          <p className="text-xl text-gray-500 max-w-md mx-auto">
            No services are currently available at this location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <Button
              key={service.id}
              variant="outline"
              onClick={() => onServiceSelect(service.id)}
              className="h-auto p-8 flex items-center justify-between text-left hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 rounded-xl group"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {service.name}
                  </h4>
                  <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-bold text-blue-700">
                      {formatDuration(service.duration)}
                    </span>
                  </div>
                </div>
                {service.description && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                )}
              </div>
              <ChevronRight className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors ml-6" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
