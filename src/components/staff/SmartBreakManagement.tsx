
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSmartBreakManagement } from '@/hooks/use-smart-break-management';
import { ActiveBreakDisplay } from './break-management/ActiveBreakDisplay';
import { BreakRequestForm } from './break-management/BreakRequestForm';
import { StaffAvailabilityOverview } from './break-management/StaffAvailabilityOverview';

export const SmartBreakManagement: React.FC = () => {
  const { t } = useTranslation();
  const {
    currentBreak,
    availableStaff,
    isLoading,
    requestBreak,
    endBreak,
    refreshStaffAvailability
  } = useSmartBreakManagement();

  if (currentBreak?.status === 'active') {
    return (
      <ActiveBreakDisplay
        currentBreak={currentBreak}
        onEndBreak={endBreak}
      />
    );
  }

  return (
    <div className="space-y-6">
      <BreakRequestForm
        availableStaff={availableStaff}
        isLoading={isLoading}
        onRequestBreak={requestBreak}
      />

      <StaffAvailabilityOverview
        availableStaff={availableStaff}
      />
    </div>
  );
};
