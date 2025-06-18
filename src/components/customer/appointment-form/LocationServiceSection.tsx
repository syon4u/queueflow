
import React, { useState, useEffect } from 'react';
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
  const [availableLocationIds, setAvailableLocationIds] = useState<string[]>([]);

  // Get available locations for selected service
  useEffect(() => {
    if (!services || !formData.serviceId) {
      setAvailableLocationIds([]);
      return;
    }

    const selectedService = services.find(s => s.id === formData.serviceId);
    if (selectedService) {
      if (!selectedService.location_id) {
        // Global service - available at all locations
        const allLocationIds = locations.map(l => l.id);
        setAvailableLocationIds(allLocationIds);
      } else {
        // Location-specific service
        setAvailableLocationIds([selectedService.location_id]);
      }
    } else {
      setAvailableLocationIds([]);
    }
  }, [formData.serviceId, services, locations]);

  // Clear location if it's no longer available for selected service
  useEffect(() => {
    if (formData.locationId && availableLocationIds.length > 0 && !availableLocationIds.includes(formData.locationId)) {
      updateField('locationId', '');
    }
  }, [availableLocationIds, formData.locationId, updateField]);

  // Filter locations based on selected service
  const filteredLocations = React.useMemo(() => {
    if (!locations) return [];
    
    if (availableLocationIds.length === 0) {
      return locations; // Show all if no service selected
    }
    
    return locations.filter(location => 
      availableLocationIds.includes(location.id)
    );
  }, [locations, availableLocationIds]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Service and Location
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span>{service.name}</span>
                      {!service.location_id && (
                        <Globe className="h-3 w-3 text-blue-500" />
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
        
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          {locationsError && (
            <p className="text-sm text-red-600">Error loading locations: {locationsError}</p>
          )}
          <Select 
            value={formData.locationId} 
            onValueChange={(value) => updateField('locationId', value)}
            disabled={locationsLoading || !formData.serviceId}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                locationsLoading 
                  ? "Loading locations..."
                  : !formData.serviceId 
                    ? "Select a service first"
                    : filteredLocations.length === 0
                      ? "No locations available"
                      : "Select a location"
              } />
              {locationsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </SelectTrigger>
            <SelectContent>
              {filteredLocations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
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
