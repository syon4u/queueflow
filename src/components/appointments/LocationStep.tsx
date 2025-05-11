
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import LocationSelector from '@/components/LocationSelector';

interface LocationStepProps {
  locationId: string;
  onLocationChange: (value: string) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ locationId, onLocationChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Label>{t('appointments.selectLocation')}</Label>
      <LocationSelector 
        value={locationId}
        onChange={onLocationChange}
      />
    </div>
  );
};

export default LocationStep;
