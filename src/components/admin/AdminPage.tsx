
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { DashboardTab } from './DashboardTab';
import { StatsTab } from './StatsTab';
import { StaffTab } from './StaffTab';
import { UserManagementTab } from './UserManagementTab';
import { LocationsTab } from './LocationsTab';
import { ServicesTab } from './ServicesTab';
import { QueueManagementTab } from './QueueManagementTab';
import SystemSettingsTab from './SystemSettingsTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import Breadcrumb from '@/components/navigation/Breadcrumb';

const AdminPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-pattern-dots bg-gradient-overlay-blue">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { label: 'Admin Dashboard', isActive: true }
            ]}
            className="mb-4"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
          <p className="text-gray-600">{t('admin.description')}</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} mb-6`}>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="queue">Queue</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="stats">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <Card className="bg-white/90 backdrop-filter backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <TabsContent value="dashboard">
                <DashboardTab />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagementTab />
              </TabsContent>
              
              <TabsContent value="staff">
                <StaffTab />
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
              
              <TabsContent value="settings">
                <SystemSettingsTab />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
