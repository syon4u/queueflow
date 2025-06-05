
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import PredictiveAnalytics from './analytics/PredictiveAnalytics';
import { PredictiveSchedulingDashboard } from './PredictiveSchedulingDashboard';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart,
  Brain,
  Calendar
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const AdvancedAnalyticsTab = () => {
  const { t } = useTranslation();

  // Get analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['advanced-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('daily-metrics');
      if (error) throw error;
      return data;
    },
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Analytics & Predictions</h2>
        <p className="text-muted-foreground">
          Deep insights, predictive analytics, and AI-powered scheduling optimization
        </p>
      </div>

      <Tabs defaultValue="predictive" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Predictive Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Scheduling</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Business Insights</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="predictive" className="space-y-4">
          <PredictiveAnalytics data={analyticsData} />
        </TabsContent>
        
        <TabsContent value="scheduling" className="space-y-4">
          <PredictiveSchedulingDashboard />
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business insights components would go here */}
            <div className="col-span-full text-center py-12 text-gray-500">
              <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Business Insights Dashboard</p>
              <p className="text-sm mt-2">Advanced business intelligence features coming soon</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsTab;
