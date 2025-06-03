
import React, { useState } from 'react';
import { DashboardTab } from './DashboardTab';
import { UserManagementTab } from './UserManagementTab';
import CustomerManagementTab from './CustomerManagementTab';
import { LocationsTab } from './LocationsTab';
import { ServicesTab } from './ServicesTab';
import { QueueManagementTab } from './QueueManagementTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import { StatsTab } from './StatsTab';
import SystemSettingsTab from './SystemSettingsTab';
import SecurityMetricsTab from './SecurityMetricsTab';
import { ModernAdminLayout } from './ModernAdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('modern-dashboard');
  const [useModernUI, setUseModernUI] = useState(true);
  const { t } = useTranslation();

  const renderContent = () => {
    if (activeTab === 'modern-dashboard' && useModernUI) {
      return <ModernAdminLayout />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'users':
        return <UserManagementTab />;
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
      case 'security':
        return <SecurityMetricsTab />;
      case 'settings':
        return <SystemSettingsTab />;
      default:
        return <ModernAdminLayout />;
    }
  };

  // If using modern UI for main dashboard, don't wrap in tabs
  if (activeTab === 'modern-dashboard' && useModernUI) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('dashboard')}
            className="bg-white/90 backdrop-blur-sm"
          >
            Switch to Classic View
          </Button>
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        <Button
          variant="outline"
          onClick={() => setActiveTab('modern-dashboard')}
        >
          Switch to Modern View
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="m-4">
          <TabsTrigger value="dashboard">{t('admin.dashboard')}</TabsTrigger>
          <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
          <TabsTrigger value="customers">{t('admin.customers')}</TabsTrigger>
          <TabsTrigger value="locations">{t('admin.locations')}</TabsTrigger>
          <TabsTrigger value="services">{t('admin.services')}</TabsTrigger>
          <TabsTrigger value="queue">{t('admin.queue')}</TabsTrigger>
          <TabsTrigger value="templates">{t('admin.templates')}</TabsTrigger>
          <TabsTrigger value="stats">{t('admin.stats')}</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">{t('admin.settings')}</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>
        <TabsContent value="customers">
          <CustomerManagementTab />
        </TabsContent>
        <TabsContent value="locations">
          <LocationsTab />
        </TabsContent>
        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>
        <TabsContent value="queue">
          <QueueManagementTab />
        </TabsContent>
        <TabsContent value="templates">
          <CommunicationTemplatesTab />
        </TabsContent>
        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityMetricsTab />
        </TabsContent>
        <TabsContent value="settings">
          <SystemSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
