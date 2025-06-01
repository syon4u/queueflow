
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PerformanceAnalyticsDashboard } from './PerformanceAnalyticsDashboard';
import { SmartBreakManagement } from './SmartBreakManagement';
import { WorkloadDistribution } from './WorkloadDistribution';
import { 
  BarChart3, 
  Coffee, 
  Users, 
  Bell 
} from 'lucide-react';

export const AdvancedStaffTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Staff Tools</h2>
        <p className="text-muted-foreground">
          Enhanced tools for performance tracking, break management, and workload optimization
        </p>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Advanced notification system coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
