
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardTab } from './DashboardTab';
import { StatsTab } from './StatsTab';
import { LocationsTab } from './LocationsTab';
import { ServicesTab } from './ServicesTab';
import { QueueManagementTab } from './QueueManagementTab';
import SystemSettingsTab from './SystemSettingsTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import CustomerManagementTab from './CustomerManagementTab';
import { MergedUsersTab } from './MergedUsersTab';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { useAdminDashboardStats } from '@/hooks/admin/use-admin-dashboard-stats';

const AdminPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { stats, refreshStats, isLoading } = useAdminDashboardStats();

  // Debug logging for AdminPage
  console.log('AdminPage - Component mounted');
  console.log('AdminPage - Current user:', user);
  console.log('AdminPage - Active tab:', activeTab);
  console.log('AdminPage - Real stats from database:', stats);
  console.log('AdminPage - Stats loading:', isLoading);

  const handleRefresh = () => {
    // Handle refresh logic - now refreshes real data
    console.log('AdminPage - Refreshing admin data...');
    refreshStats();
  };

  const handleNotificationClick = () => {
    console.log('AdminPage - Notification center clicked');
  };

  const handleSettingsClick = () => {
    console.log('AdminPage - Settings clicked');
  };

  const renderMainContent = () => {
    console.log('AdminPage - Rendering content for tab:', activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'users':
        return <MergedUsersTab />;
      case 'customers':
        return <CustomerManagementTab />;
      case 'locations':
        return <LocationsTab />;
      case 'services':
        return <ServicesTab />;
      case 'queue':
        return <QueueManagementTab />;
      case 'templates':
        return <CommunicationTemplatesTab />;
      case 'stats':
        return <StatsTab />;
      case 'settings':
        return <SystemSettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            {/* Header - Only show on dashboard tab */}
            {activeTab === 'dashboard' && (
              <div className="bg-white border-b p-6">
                <AdminDashboardHeader
                  systemStatus={stats.systemStatus}
                  totalUsers={stats.totalUsers}
                  activeStaff={stats.activeStaff}
                  todayAppointments={stats.todayAppointments}
                  onRefresh={handleRefresh}
                  onNotificationClick={handleNotificationClick}
                  onSettingsClick={handleSettingsClick}
                />
              </div>
            )}
            
            {/* Main Content */}
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <Card className="bg-white/90 backdrop-filter backdrop-blur-sm border border-gray-200/50">
                  <CardContent className="p-6">
                    {renderMainContent()}
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
