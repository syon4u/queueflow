
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { DashboardTab } from './DashboardTab';
import { StatsTab } from './StatsTab';
import { UserManagementTab } from './UserManagementTab';
import { LocationsTab } from './LocationsTab';
import { ServicesTab } from './ServicesTab';
import { StaffTab } from './StaffTab';
import { EmployeeTab } from './EmployeeTab';
import CustomerManagementTab from './CustomerManagementTab';
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

  // Get current user's role to verify admin access
  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      return role?.role || 'customer';
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (userRole !== 'admin') {
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
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader 
        systemStatus="operational"
        totalUsers={0}
        activeStaff={0}
        todayAppointments={0}
        recentAlerts={[]}
        capacityUtilization={0}
        avgWaitTime={0}
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
            <UserManagementTab />
          </TabsContent>
          
          <TabsContent value="locations">
            <LocationsTab />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          
          <TabsContent value="staff">
            <StaffTab />
          </TabsContent>
          
          <TabsContent value="employees">
            <EmployeeTab />
          </TabsContent>
          
          <TabsContent value="customers">
            <CustomerManagementTab />
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
          
          <TabsContent value="merged-users">
            <MergedUsersTab />
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
  );
};

export default AdminPage;
