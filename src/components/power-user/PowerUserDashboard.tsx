
import React, { Suspense, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PowerUserStatsCards } from './PowerUserStatsCards';
import { PowerUserAppointmentsTab } from './tabs/PowerUserAppointmentsTab';
import { UserAdministrationTab } from './tabs/UserAdministrationTab';
import { LocationsServicesTab } from './tabs/LocationsServicesTab';
import { AppointmentOverridesTab } from './tabs/AppointmentOverridesTab';
import { useRealtimeAppointments } from '@/hooks/power-user/useRealtimeAppointments';
import { useAuditLog } from '@/hooks/power-user/useAuditLog';

// These three tabs pull in recharts; load them with the tab instead of the
// dashboard shell.
const SMSNotificationTab = React.lazy(() =>
  import('./tabs/SMSNotificationTab').then((m) => ({ default: m.SMSNotificationTab }))
);
const ReportsAnalyticsTab = React.lazy(() =>
  import('./tabs/ReportsAnalyticsTab').then((m) => ({ default: m.ReportsAnalyticsTab }))
);
const AdvancedStaffTab = React.lazy(() =>
  import('@/components/staff/AdvancedStaffTab').then((m) => ({ default: m.AdvancedStaffTab }))
);

const TabFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

interface PowerUserDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const PowerUserDashboard: React.FC<PowerUserDashboardProps> = ({
  activeTab = 'dashboard',
  onTabChange
}) => {
  // Enable real-time updates
  useRealtimeAppointments();
  
  const { logAction } = useAuditLog();

  // Log tab navigation for audit purposes
  useEffect(() => {
    if (activeTab && activeTab !== 'dashboard') {
      logAction({
        action: 'navigate',
        resource_type: 'power_user_tab',
        resource_id: activeTab,
        details: { tab: activeTab, timestamp: new Date().toISOString() }
      });
    }
  }, [activeTab, logAction]);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-left">Power User Portal</h2>
        <p className="text-muted-foreground text-left text-sm">
          Comprehensive management tools and administrative controls with real-time updates
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsContent value="dashboard" className="space-y-6">
          <PowerUserStatsCards />
          <PowerUserAppointmentsTab />
        </TabsContent>

        <TabsContent value="appointments">
          <PowerUserAppointmentsTab />
        </TabsContent>

        <TabsContent value="users">
          <UserAdministrationTab />
        </TabsContent>

        <TabsContent value="locations">
          <LocationsServicesTab />
        </TabsContent>

        <TabsContent value="communications">
          <Suspense fallback={<TabFallback />}>
            <SMSNotificationTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="reports">
          <Suspense fallback={<TabFallback />}>
            <ReportsAnalyticsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="overrides">
          <AppointmentOverridesTab />
        </TabsContent>

        <TabsContent value="advanced-tools">
          <Suspense fallback={<TabFallback />}>
            <AdvancedStaffTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
