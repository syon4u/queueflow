import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardIcon, UserIcon, Settings } from 'lucide-react';
import { DashboardTab } from './DashboardTab';
import { StaffTab } from './StaffTab';
import { EmployeeTab } from './EmployeeTab';
import { SettingsTab } from './SettingsTab';
import { MergedUsersTab } from './MergedUsersTab';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      
      case 'users':
        return <MergedUsersTab />;
      
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 rounded-md p-1">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-200 rounded-md">
            <DashboardIcon className="h-5 w-5 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-200 rounded-md">
            <UserIcon className="h-5 w-5 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gray-200 rounded-md">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </Tabs>
    </div>
  );
};
