
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
import { useLocations } from '@/hooks/appointment-form/useLocations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LocationStepProps {
  locationId: string;
  onLocationChange: (value: string) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ locationId, onLocationChange }) => {
  const { t } = useTranslation();
  const { locations, isLoading, error } = useLocations();
  
  console.log('LocationStep - Component state:', {
    locationsCount: locations?.length || 0,
    isLoading,
    error,
    selectedLocationId: locationId
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Label>{t('appointments.selectLocation')}</Label>
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading locations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Label>{t('appointments.selectLocation')}</Label>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading locations: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="space-y-4">
        <Label>{t('appointments.selectLocation')}</Label>
        <Alert>
          <AlertDescription>
            No locations are currently available for appointments.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Label>{t('appointments.selectLocation')}</Label>
      <Select value={locationId} onValueChange={onLocationChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('appointments.selectLocationPlaceholder')} />
        </SelectTrigger>
        <SelectContent>
          {locations.map(location => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationStep;
