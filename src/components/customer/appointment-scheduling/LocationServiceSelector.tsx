
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Globe } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { NewCustomerFormValues } from './NewCustomerForm';
import { useLocations } from '@/hooks/appointment-form/useLocations';

interface Service {
  id: string;
  name: string;
  duration: number;
  location_id?: string; // Now optional for global services
}

interface LocationServiceSelectorProps {
  services: Service[] | undefined;
  servicesLoading: boolean;
  servicesError: string | null;
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
  const { data: locations, isLoading: locationsLoading, error: locationsError } = useLocations();

  // Filter services: show global services and location-specific services
  const filteredServices = React.useMemo(() => {
    if (!services) return [];
    
    // Show both global services (no location_id) and location-specific services
    return services.filter(service => 
      !service.location_id || service.location_id === selectedLocationId
    );
  }, [services, selectedLocationId]);

  console.log('LocationServiceSelector - Component state:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError,
    servicesCount: filteredServices?.length || 0,
    globalServicesCount: services?.filter(s => !s.location_id)?.length || 0,
    servicesLoading,
    servicesError,
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
            // Don't auto-clear service anymore since global services are available everywhere
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
              Error loading services: {servicesError}
            </AlertDescription>
          </Alert>
        )}
        
        <Select 
          value={selectedServiceId}
          onValueChange={(value) => setValue('service_id', value)}
          disabled={servicesLoading || !filteredServices?.length}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              servicesLoading 
                ? "Loading services..."
                : !filteredServices?.length 
                  ? "No services available"
                  : "Select a service"
            } />
            {servicesLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {filteredServices?.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span>{service.name}</span>
                    {!service.location_id && (
                      <Globe className="h-3 w-3 text-blue-500" title="Global service" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {service.duration} min
                    {!service.location_id && (
                      <span className="ml-2 text-blue-600">(Global)</span>
                    )}
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
