
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [availableLocationIds, setAvailableLocationIds] = useState<string[]>([]);

  // Services are stored one row per location. Group by name so the customer
  // sees each service once; a service is available at every location that has
  // a row with that name (or everywhere, if any row is global).
  const uniqueServices = React.useMemo(() => {
    if (!services) return [];
    const seen = new Map<string, Service>();
    for (const svc of services) {
      if (!seen.has(svc.name)) seen.set(svc.name, svc);
    }
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  // Get available locations for selected service
  useEffect(() => {
    if (!services || !formData.serviceId) {
      setAvailableLocationIds([]);
      return;
    }

    const selectedService = services.find(s => s.id === formData.serviceId);
    if (!selectedService) {
      setAvailableLocationIds([]);
      return;
    }
    const siblings = services.filter(s => s.name === selectedService.name);
    if (siblings.some(s => !s.location_id)) {
      setAvailableLocationIds(locations.map(l => l.id));
    } else {
      setAvailableLocationIds(Array.from(new Set(siblings.map(s => s.location_id as string))));
    }
  }, [formData.serviceId, services, locations]);

  // Once a location is chosen, point serviceId at the row for that location
  // so the appointment is stored against the correct service/location pair.
  useEffect(() => {
    if (!services || !formData.serviceId || !formData.locationId) return;
    const current = services.find(s => s.id === formData.serviceId);
    if (!current || current.location_id === formData.locationId) return;
    const match = services.find(
      s => s.name === current.name && s.location_id === formData.locationId
    );
    if (match && match.id !== formData.serviceId) {
      updateField('serviceId', match.id);
    }
  }, [formData.locationId, formData.serviceId, services, updateField]);

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
        {t('public.booking.serviceLocation.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service">{t('public.booking.serviceLocation.service')}</Label>
          {servicesError && (
            <p className="text-sm text-red-600">{t('public.booking.serviceLocation.servicesError', { error: servicesError })}</p>
          )}
          <Select 
            value={formData.serviceId} 
            onValueChange={(value) => updateField('serviceId', value)}
            disabled={servicesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                servicesLoading
                  ? t('public.booking.serviceLocation.loadingServices')
                  : t('public.booking.serviceLocation.selectService')
              } />
              {servicesLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </SelectTrigger>
            <SelectContent>
              {uniqueServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span>{service.name}</span>
                      {!service.location_id && (
                        <Globe className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {t('public.booking.serviceLocation.minutes', { count: service.duration })}
                      {!service.location_id && (
                        <span className="ml-2 text-blue-600">{t('public.booking.serviceLocation.allLocations')}</span>
                      )}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">{t('public.booking.serviceLocation.location')}</Label>
          {locationsError && (
            <p className="text-sm text-red-600">{t('public.booking.serviceLocation.locationsError', { error: locationsError })}</p>
          )}
          <Select 
            value={formData.locationId} 
            onValueChange={(value) => updateField('locationId', value)}
            disabled={locationsLoading || !formData.serviceId}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                locationsLoading
                  ? t('public.booking.serviceLocation.loadingLocations')
                  : !formData.serviceId
                    ? t('public.booking.serviceLocation.selectServiceFirst')
                    : filteredLocations.length === 0
                      ? t('public.booking.serviceLocation.noLocationsAvailable')
                      : t('public.booking.serviceLocation.selectLocation')
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
