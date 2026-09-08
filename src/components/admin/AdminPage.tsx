
import React, { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { DashboardTab } from './DashboardTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import SystemSettingsTab from './SystemSettingsTab';
import SecurityMetricsTab from './SecurityMetricsTab';
import { SMSCommandsTab } from './SMSCommandsTab';
import { CapacityManagementTab } from './CapacityManagementTab';
import { CapacityThrottlingTab } from './CapacityThrottlingTab';
import { QueueFlow2Tab } from './QueueFlow2Tab';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { AdminTopNavigation } from './AdminTopNavigation';
import BackendHealthCheck from './BackendHealthCheck';

// The analytics tab owns every recharts-based dashboard on this page; load it
// (and recharts) only when the tab is opened rather than with the admin shell.
const AdvancedAnalyticsTab = React.lazy(() =>
  import('./AdvancedAnalyticsTab').then((m) => ({ default: m.AdvancedAnalyticsTab }))
);

const TabFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { role } = useAuth();

  const isAdminUser = role === 'admin';

  const { data: totalUsers = 0 } = useQuery({
    queryKey: ['admin-header-total-users'],
    queryFn: async () => {
      const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });
  const { data: activeStaff = 0 } = useQuery({
    queryKey: ['admin-header-active-staff'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_roles').select('*', { count: 'exact', head: true }).in('role', ['staff', 'power_user', 'admin']);
      if (error) throw error;
      return count || 0;
    },
  });
  const { data: todayAppointments = 0 } = useQuery({
    queryKey: ['admin-header-today-appointments'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('appointments').select('*', { count: 'exact', head: true })
        .gte('scheduled_time', `${today}T00:00:00`).lt('scheduled_time', `${today}T23:59:59`);
      if (error) throw error;
      return count || 0;
    },
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  if (!isAdminUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const header = (
    <div className="space-y-0">
      <div className="p-6">
        <AdminDashboardHeader 
          systemStatus="healthy"
          totalUsers={totalUsers}
          activeStaff={activeStaff}
          todayAppointments={todayAppointments}
          onRefresh={handleRefresh}
          onNotificationClick={handleNotificationClick}
          onSettingsClick={handleSettingsClick}
        />
      </div>
      <AdminTopNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );

  const sidebar = <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />;

  return (
    <QueueProvider>
      <AppLayout sidebar={sidebar} header={header}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>
          
          <TabsContent value="communication">
            <CommunicationTemplatesTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <SystemSettingsTab />
          </TabsContent>
          
          <TabsContent value="security">
            <SecurityMetricsTab />
          </TabsContent>
          
          <TabsContent value="sms-commands">
            <SMSCommandsTab />
          </TabsContent>
          
          <TabsContent value="advanced-analytics">
            <Suspense fallback={<TabFallback />}>
              <AdvancedAnalyticsTab />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="capacity-management">
            <CapacityManagementTab />
          </TabsContent>
          
          <TabsContent value="capacity-throttling">
            <CapacityThrottlingTab />
          </TabsContent>
          
          <TabsContent value="queue-flow-2">
            <QueueFlow2Tab />
          </TabsContent>
          
          <TabsContent value="backend-health">
            <BackendHealthCheck />
          </TabsContent>
        </Tabs>
      </AppLayout>
    </QueueProvider>
  );
};

export default AdminPage;
