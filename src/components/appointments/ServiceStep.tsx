
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
import { Loader2, AlertCircle } from 'lucide-react';

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
  
  console.log('ServiceStep - Props:', {
    serviceId,
    locationId,
    servicesCount: services.length,
    isLoading,
    error,
    services
  });
  
  const selectedService = services.find(s => s.id === serviceId);

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

  // Show location required message
  if (!locationId) {
    return (
      <div className="space-y-4">
        <Label>{t('appointments.selectService')}</Label>
        <Alert>
          <AlertDescription>
            Please select a location first to see available services.
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
        disabled={isLoading || !locationId || services.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue 
            placeholder={
              isLoading 
                ? "Loading services..." 
                : services.length === 0 
                  ? "No services available"
                  : t('appointments.selectServicePlaceholder')
            } 
          />
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </SelectTrigger>
        <SelectContent>
          {services.map(service => (
            <SelectItem key={service.id} value={service.id}>
              <div className="flex flex-col">
                <span>{service.name}</span>
                <span className="text-sm text-muted-foreground">
                  {service.duration} {t('appointments.minutes')}
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
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-yellow-100 rounded text-xs">
          <strong>Debug Info:</strong><br />
          Location ID: {locationId || 'None'}<br />
          Service ID: {serviceId || 'None'}<br />
          Services Available: {services.length}<br />
          Loading: {isLoading ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
};

export default ServiceStep;
