import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LocationsTab } from '@/components/admin/LocationsTab';
import { ServicesTab } from '@/components/admin/ServicesTab';
import { StaffTab } from '@/components/admin/StaffTab';
import { StatsTab } from '@/components/admin/StatsTab';
import { QueueManagementTab } from '@/components/admin/QueueManagementTab';
import SystemSettingsTab from '@/components/admin/SystemSettingsTab';
import { DashboardTab } from '@/components/admin/DashboardTab';
import UserManagementTab from '@/components/admin/UserManagementTab';
import { QueueProvider } from '@/context/QueueContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';

const AdminPage = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Handle tab switching from URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    
    if (tabParam && ['dashboard', 'staff', 'locations', 'services', 'queue', 'stats', 'users', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  
  return (
    <BrowardLayout headerTitle="Admin Portal">
      <BrowardHero 
        title="Admin Dashboard" 
        subtitle="Manage system settings, users, and view analytics"
        backgroundStyle="gradient"
      />
      
      <div className="container mx-auto p-6">
        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} value={activeTab} className="w-full">
          <TabsList className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-8'} mb-6`}>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="stats">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-6">
              <TabsContent value="dashboard">
                <DashboardTab />
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
                <QueueProvider>
                  <QueueManagementTab />
                </QueueProvider>
              </TabsContent>
              <TabsContent value="stats">
                <StatsTab />
              </TabsContent>
              <TabsContent value="users">
                <UserManagementTab />
              </TabsContent>
              <TabsContent value="settings">
                <SystemSettingsTab />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </BrowardLayout>
  );
};

export default AdminPage;