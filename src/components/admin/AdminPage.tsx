
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';
import { DashboardTab } from './DashboardTab';
import { StatsTab } from './StatsTab';
import { LocationsTab } from './LocationsTab';
import { ServicesTab } from './ServicesTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import { QueueManagementTab } from './QueueManagementTab';
import SystemSettingsTab from './SystemSettingsTab';
import SecurityMetricsTab from './SecurityMetricsTab';
import { SMSCommandsTab } from './SMSCommandsTab';
import { MergedUsersTab } from './MergedUsersTab';
import { AdvancedAnalyticsTab } from './AdvancedAnalyticsTab';
import { CapacityManagementTab } from './CapacityManagementTab';
import { CapacityThrottlingTab } from './CapacityThrottlingTab';
import { QueueFlow2Tab } from './QueueFlow2Tab';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { AdminTopNavigation } from './AdminTopNavigation';
import BackendHealthCheck from './BackendHealthCheck';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { role } = useAuth();

  // Since authentication is disabled, always allow admin access for testing
  const isAdminUser = role === 'admin' || true;

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

  return (
    <QueueProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminDashboardHeader 
          systemStatus="healthy"
          totalUsers={247}
          activeStaff={24}
          todayAppointments={156}
          onRefresh={handleRefresh}
          onNotificationClick={handleNotificationClick}
          onSettingsClick={handleSettingsClick}
        />
        <AdminTopNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>
            
            <TabsContent value="stats">
              <StatsTab />
            </TabsContent>
            
            <TabsContent value="users">
              <MergedUsersTab />
            </TabsContent>
            
            <TabsContent value="locations">
              <LocationsTab />
            </TabsContent>
            
            <TabsContent value="services">
              <ServicesTab />
            </TabsContent>
            
            <TabsContent value="communication">
              <CommunicationTemplatesTab />
            </TabsContent>
            
            <TabsContent value="queue">
              <QueueManagementTab />
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
        </main>
      </div>
    </QueueProvider>
  );
};

export default AdminPage;
