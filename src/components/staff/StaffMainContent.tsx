import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Settings, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StaffStatusSection from './StaffStatusSection';
import { EnhancedQueueManagement } from './EnhancedQueueManagement';
import EnhancedAppointmentTable from './EnhancedAppointmentTable';
import { UnifiedQueueManagement } from '@/components/shared/queue/UnifiedQueueManagement';
import { UndoActionButton } from './UndoActionButton';
import { StaffAvailabilityControl } from './StaffAvailabilityControl';
import DocumentsPanel from '@/components/documents/DocumentsPanel';
import { useStaffNotifications } from '@/hooks/use-staff-notifications';

interface StaffMainContentProps {
  activeSection: string;
  onRefresh: () => void;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  onStatusChange: () => void;
}

export const StaffMainContent: React.FC<StaffMainContentProps> = ({
  activeSection,
  onRefresh,
  onNotificationClick,
  onSettingsClick,
  onStatusChange
}) => {
  const { t } = useTranslation();
  const { unreadCount, requestNotificationPermission } = useStaffNotifications();

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'basic-queue':
        return (
          <div className="space-y-6">
            <UnifiedQueueManagement 
              variant="staff" 
              showAdvancedControls={false}
              showAllStatuses={false}
            />
          </div>
        );

      case 'enhanced-queue':
        return <EnhancedQueueManagement locationId="" />;

      case 'appointments':
        return <EnhancedAppointmentTable />;

      case 'documents':
        return <DocumentsPanel />;

      default:
        return (
          <div className="space-y-6">
            <UnifiedQueueManagement 
              variant="staff" 
              showAdvancedControls={false}
              showAllStatuses={false}
            />
          </div>
        );
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <h1 className="text-xl font-semibold">{t('staff.dashboard')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('staff.manageQueue')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <UndoActionButton />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('common.refresh')}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                requestNotificationPermission();
                onNotificationClick();
              }}
              className="relative gap-2"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
              {t('staff.notifications')}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('common.settings')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status and Availability Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaffStatusSection onStatusChange={onStatusChange} />
          <StaffAvailabilityControl />
        </div>

        {/* Main Content */}
        {renderSectionContent()}
      </div>
    </main>
  );
};
