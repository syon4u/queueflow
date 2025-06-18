
import React from 'react';
import { useAppData } from '@/hooks/useAppData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  locationId?: string;
}

const ServiceSelector = ({ value, onChange, locationId }: ServiceSelectorProps) => {
  const { services, isLoading, error } = useAppData();

  // Filter services: show all services if no locationId, otherwise show global and location-specific services
  const filteredServices = React.useMemo(() => {
    if (!services) return [];
    
    // If no locationId, show ALL services
    if (!locationId) {
      return services;
    }
    
    // If locationId is provided, show both global and location-specific services
    return services.filter(service => 
      !service.location_id || service.location_id === locationId
    );
  }, [services, locationId]);

  console.log('ServiceSelector - Component state:', {
    value,
    locationId,
    servicesCount: filteredServices?.length || 0,
    isLoading,
    error: error?.message,
    globalServices: services?.filter(s => !s.location_id)?.length || 0,
    locationServices: locationId ? services?.filter(s => s.location_id === locationId)?.length || 0 : 0
  });

  // Show error state
  if (error) {
    return (
      <FormItem>
        <FormLabel>Service</FormLabel>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading services: {error.message}
          </AlertDescription>
        </Alert>
        <FormMessage />
      </FormItem>
    );
  }

  return (
    <FormItem>
      <FormLabel>Service *</FormLabel>
      <FormControl>
        <Select 
          value={value || ''} 
          onValueChange={onChange} 
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                isLoading 
                  ? "Loading services..."
                  : filteredServices && filteredServices.length === 0
                    ? "No services available"
                    : "Select a service"
              } 
            />
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {filteredServices && filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex flex-col">
                    <span>{service.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {service.duration} min
                      {!service.location_id && (
                        <span className=" ml-2 px-1 bg-blue-100 text-blue-600 rounded text-xs">
                          Global
                        </span>
                      )}
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              !isLoading && (
                <SelectItem value="no-services" disabled>
                  No services available
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
          <strong>ServiceSelector Debug:</strong><br />
          Location ID: {locationId || 'None'}<br />
          Current Value: {value || 'None'}<br />
          Filtered Services Count: {filteredServices?.length || 0}<br />
          Global Services: {services?.filter(s => !s.location_id)?.length || 0}<br />
          Location Services: {locationId ? services?.filter(s => s.location_id === locationId)?.length || 0 : 0}<br />
          Loading: {isLoading ? 'Yes' : 'No'}<br />
          Error: {error?.message || 'None'}
        </div>
      )}
    </FormItem>
  );
};

export default ServiceSelector;
