
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  Bell, 
  Settings,
  Activity,
  Wrench,
  Search
} from 'lucide-react';
import { QueueDashboard } from './QueueDashboard';
import { EnhancedQueueDashboard } from './EnhancedQueueDashboard';
import { StaffAppointmentsTab } from './StaffAppointmentsTab';
import CustomerSearchTab from './CustomerSearchTab';
import { AdvancedStaffTools } from './AdvancedStaffTools';

interface StaffMainContentProps {
  activeSection: string;
  activeAppointments: any[];
  onRefresh: () => void;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  onStatusChange: () => void;
}

export const StaffMainContent: React.FC<StaffMainContentProps> = ({
  activeSection,
  activeAppointments,
  onRefresh,
  onNotificationClick,
  onSettingsClick,
  onStatusChange
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'basic-queue':
        return <QueueDashboard />;
      
      case 'enhanced-queue':
        return (
          <EnhancedQueueDashboard 
            appointments={activeAppointments}
            onRefresh={onRefresh}
            onStatusChange={onStatusChange}
          />
        );
      
      case 'appointments':
        return <StaffAppointmentsTab />;
      
      case 'customer-search':
        return <CustomerSearchTab />;
      
      case 'advanced-tools':
        return <AdvancedStaffTools />;
      
      default:
        return <QueueDashboard />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="w-full border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeSection === 'basic-queue' && 'Queue Dashboard'}
              {activeSection === 'enhanced-queue' && 'Enhanced Queue'}
              {activeSection === 'appointments' && 'Appointments'}
              {activeSection === 'customer-search' && 'Customer Search'}
              {activeSection === 'advanced-tools' && 'Advanced Tools'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={onNotificationClick}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onSettingsClick}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};
