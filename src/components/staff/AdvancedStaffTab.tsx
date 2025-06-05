
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PerformanceAnalyticsDashboard } from './PerformanceAnalyticsDashboard';
import { SmartBreakManagement } from './SmartBreakManagement';
import { WorkloadDistribution } from './WorkloadDistribution';
import { SmartNotificationSystem } from './SmartNotificationSystem';
import { AutomatedAppointmentReminders } from './AutomatedAppointmentReminders';
import { VoiceNotificationSystem } from './VoiceNotificationSystem';
import { 
  BarChart3, 
  Coffee, 
  Users, 
  Bell,
  Calendar,
  Phone
} from 'lucide-react';

export const AdvancedStaffTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Staff Tools</h2>
        <p className="text-muted-foreground">
          Enhanced tools for performance tracking, break management, workload optimization, notifications, reminders, and voice calls
        </p>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="breaks" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            <span className="hidden sm:inline">Break Management</span>
          </TabsTrigger>
          <TabsTrigger value="workload" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Workload</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Reminders</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Voice Calls</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceAnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="breaks" className="space-y-4">
          <SmartBreakManagement />
        </TabsContent>
        
        <TabsContent value="workload" className="space-y-4">
          <WorkloadDistribution />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <SmartNotificationSystem />
        </TabsContent>
        
        <TabsContent value="reminders" className="space-y-4">
          <AutomatedAppointmentReminders />
        </TabsContent>
        
        <TabsContent value="voice" className="space-y-4">
          <VoiceNotificationSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
};
