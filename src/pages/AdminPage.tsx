
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LocationsTab } from '@/components/admin/LocationsTab';
import { ServicesTab } from '@/components/admin/ServicesTab';
import { StaffTab } from '@/components/admin/StaffTab';
import { StatsTab } from '@/components/admin/StatsTab';
import { QueueManagementTab } from '@/components/admin/QueueManagementTab';
import { SystemSettingsTab } from '@/components/admin/SystemSettingsTab';
import { DashboardTab } from '@/components/admin/DashboardTab';
import { QueueProvider } from '@/context/QueueContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, Settings, Database, ChartBar, Calendar, Home } from 'lucide-react';

const AdminPage = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <ChartBar className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/"><Home className="h-4 w-4 mr-1" /> Home</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/customer">Customer</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/staff">Staff</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin">Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">System Administration</h1>
          <p className="text-muted-foreground">Manage system settings, users, and view analytics</p>
        </div>

        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} value={activeTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="queue">Queue Management</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-6">
              <TabsContent value="dashboard">
                <DashboardTab />
              </TabsContent>
              <TabsContent value="users">
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
              <TabsContent value="reports">
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
