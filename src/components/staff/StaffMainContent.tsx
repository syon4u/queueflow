
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
import { CustomerSearchTab } from './CustomerSearchTab';
import { AdvancedStaffTools } from './AdvancedStaffTools';
import { StaffHeader } from './StaffHeader';

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
      <StaffHeader 
        onNotificationClick={onNotificationClick}
        onSettingsClick={onSettingsClick}
        activeSection={activeSection}
      />
      
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};
