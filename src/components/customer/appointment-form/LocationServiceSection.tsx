
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2, Globe } from 'lucide-react';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';

interface Location {
  id: string;
  name: string;
  address?: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  description?: string;
  location_id?: string; // Now optional for global services
}

interface LocationServiceSectionProps {
  formData: CustomerAppointmentData;
  updateField: (field: keyof CustomerAppointmentData, value: string) => void;
  locations: Location[];
  locationsLoading: boolean;
  locationsError: string | null;
  services: Service[];
  servicesLoading: boolean;
  servicesError: string | null;
}

const LocationServiceSection = ({ 
  formData, 
  updateField, 
  locations, 
  locationsLoading, 
  locationsError,
  services,
  servicesLoading,
  servicesError
}: LocationServiceSectionProps) => {
  // Filter services: show global services and location-specific services
  const filteredServices = React.useMemo(() => {
    if (!services) return [];
    
    // Show both global services (no location_id) and location-specific services
    return services.filter(service => 
      !service.location_id || service.location_id === formData.locationId
    );
  }, [services, formData.locationId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Location and Service
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          {locationsError && (
            <p className="text-sm text-red-600">Error loading locations: {locationsError}</p>
          )}
          <Select 
            value={formData.locationId} 
            onValueChange={(value) => updateField('locationId', value)}
            disabled={locationsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                locationsLoading 
                  ? "Loading locations..." 
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
            <p className="text-sm text-red-600">Error loading services: {servicesError}</p>
          )}
          <Select 
            value={formData.serviceId} 
            onValueChange={(value) => updateField('serviceId', value)}
            disabled={servicesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                servicesLoading 
                  ? "Loading services..."
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
                        <span className="ml-2 text-blue-600">(Available at all locations)</span>
                      )}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LocationServiceSection;
