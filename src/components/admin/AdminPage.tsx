
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueueProvider } from '@/context/QueueContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { DashboardTab } from './DashboardTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import SystemSettingsTab from './SystemSettingsTab';
import SecurityMetricsTab from './SecurityMetricsTab';
import { SMSCommandsTab } from './SMSCommandsTab';
import { AdvancedAnalyticsTab } from './AdvancedAnalyticsTab';
import { CapacityManagementTab } from './CapacityManagementTab';
import { CapacityThrottlingTab } from './CapacityThrottlingTab';
import { QueueFlow2Tab } from './QueueFlow2Tab';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { AdminTopNavigation } from './AdminTopNavigation';
import BackendHealthCheck from './BackendHealthCheck';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Since auth is disabled, always allow admin access
  const isAdminUser = true;

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
          totalUsers={247}
          activeStaff={24}
          todayAppointments={156}
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
            <AdvancedAnalyticsTab />
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
