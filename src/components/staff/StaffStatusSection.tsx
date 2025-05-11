
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import StaffBreakControl from './StaffBreakControl';
import BlackoutPeriodControl from './BlackoutPeriodControl';
import { useAuth } from '@/context/AuthContext';

interface StaffStatusSectionProps {
  onStatusChange?: () => void;
}

const StaffStatusSection: React.FC<StaffStatusSectionProps> = ({ onStatusChange }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{t('staff.status.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('staff.status.description')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StaffBreakControl onStatusChange={onStatusChange} />
            {/* Pass the location ID if available, otherwise just enable component without location-specific features */}
            <BlackoutPeriodControl locationId={user?.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffStatusSection;
