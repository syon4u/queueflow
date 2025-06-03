import React, { useState } from 'react';
import { DashboardTab } from './DashboardTab';
import { UserManagementTab } from './UserManagementTab';
import { CustomerManagementTab } from './CustomerManagementTab';
import { LocationsTab } from './LocationsTab';
import { ServicesTab } from './ServicesTab';
import { QueueManagementTab } from './QueueManagementTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import { StatsTab } from './StatsTab';
import { SystemSettingsTab } from './SystemSettingsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from 'react-i18next';
import SecurityMetricsTab from './SecurityMetricsTab';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useTranslation();

  const renderContent = () => {
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
        return <DashboardTab />;
    }
  };

  return (
    <div>
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
        {renderContent()}
      </Tabs>
    </div>
  );
};
