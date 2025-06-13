
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Service } from '@/hooks/appointment-form/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Globe } from 'lucide-react';

interface ServiceStepProps {
  serviceId: string;
  onServiceChange: (value: string) => void;
  locationId: string;
  services: Service[];
  isLoading?: boolean;
  error?: string | null;
}

const ServiceStep: React.FC<ServiceStepProps> = ({ 
  serviceId, 
  onServiceChange, 
  locationId,
  services = [],
  isLoading = false,
  error = null
}) => {
  const { t } = useTranslation();
  
  // Filter services: show global services and location-specific services
  const filteredServices = React.useMemo(() => {
    if (!services) return [];
    
    // Show both global services (no location_id) and location-specific services
    return services.filter(service => 
      !service.location_id || service.location_id === locationId
    );
  }, [services, locationId]);
  
  console.log('ServiceStep - Props:', {
    serviceId,
    locationId,
    servicesCount: filteredServices.length,
    globalServicesCount: services.filter(s => !s.location_id).length,
    isLoading,
    error,
    services
  });
  
  const selectedService = filteredServices.find(s => s.id === serviceId);

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <Label>{t('appointments.selectService')}</Label>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading services: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label>{t('appointments.selectService')} *</Label>
      
      <Select 
        value={serviceId || ''} 
        onValueChange={onServiceChange}
        disabled={isLoading || filteredServices.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue 
            placeholder={
              isLoading 
                ? "Loading services..." 
                : filteredServices.length === 0 
                  ? "No services available"
                  : t('appointments.selectServicePlaceholder')
            } 
          />
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </SelectTrigger>
        <SelectContent>
          {filteredServices.map(service => (
            <SelectItem key={service.id} value={service.id}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span>{service.name}</span>
                  {!service.location_id && (
                    <Globe className="h-3 w-3 text-blue-500" title="Global service" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {service.duration} {t('appointments.minutes')}
                  {!service.location_id && (
                    <span className="ml-2 text-blue-600">(Available at all locations)</span>
                  )}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Service Description */}
      {serviceId && selectedService?.description && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Description:</strong> {selectedService.description}
          </p>
        </div>
      )}
      
      {/* Service Duration */}
      {serviceId && selectedService && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium">{t('appointments.duration')}: </span>
          {selectedService.duration} {t('appointments.minutes')}
          {!selectedService.location_id && (
            <span className="ml-2 text-blue-600 font-medium">(Global Service)</span>
          )}
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-yellow-100 rounded text-xs">
          <strong>Debug Info:</strong><br />
          Location ID: {locationId || 'None'}<br />
          Service ID: {serviceId || 'None'}<br />
          Filtered Services: {filteredServices.length}<br />
          Global Services: {services.filter(s => !s.location_id).length}<br />
          Loading: {isLoading ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
};

export default ServiceStep;
