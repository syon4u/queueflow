
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
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminTopNavigation } from './AdminTopNavigation';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <SidebarInset className="flex-1">
          <AdminTopNavigation />
          
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
