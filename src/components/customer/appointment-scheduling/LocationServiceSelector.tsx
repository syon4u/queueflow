
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { NewCustomerFormValues } from './NewCustomerForm';
import { useLocations } from '@/hooks/appointment-form/useLocations';

interface Service {
  id: string;
  name: string;
  duration: number;
}

interface LocationServiceSelectorProps {
  services: Service[] | undefined;
  servicesLoading: boolean;
  servicesError: Error | null;
  selectedLocationId: string;
  selectedServiceId: string;
  setValue: UseFormSetValue<NewCustomerFormValues>;
}

const LocationServiceSelector: React.FC<LocationServiceSelectorProps> = ({
  services,
  servicesLoading,
  servicesError,
  selectedLocationId,
  selectedServiceId,
  setValue
}) => {
  const { locations, isLoading: locationsLoading, error: locationsError } = useLocations();

  console.log('LocationServiceSelector - Component state:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError: servicesError?.message,
    selectedLocationId,
    selectedServiceId
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        
        {locationsError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading locations: {locationsError}
            </AlertDescription>
          </Alert>
        )}
        
        <Select 
          value={selectedLocationId}
          onValueChange={(value) => {
            setValue('location_id', value);
            setValue('service_id', ''); // Clear service when location changes
          }}
          disabled={locationsLoading || !locations?.length}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              locationsLoading 
                ? "Loading locations..."
                : !locations?.length 
                  ? "No locations available"
                  : "Select a location"
            } />
            {locationsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {locations?.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service *</Label>
        
        {servicesError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading services: {servicesError.message}
            </AlertDescription>
          </Alert>
        )}
        
        {!selectedLocationId && (
          <Alert>
            <AlertDescription>
              Please select a location first to see available services.
            </AlertDescription>
          </Alert>
        )}
        
        <Select 
          value={selectedServiceId}
          onValueChange={(value) => setValue('service_id', value)}
          disabled={!selectedLocationId || servicesLoading || !services?.length}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !selectedLocationId 
                ? "Select a location first"
                : servicesLoading 
                  ? "Loading services..."
                  : !services?.length 
                    ? "No services available"
                    : "Select a service"
            } />
            {servicesLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {services?.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                <div className="flex flex-col">
                  <span>{service.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {service.duration} min
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationServiceSelector;
