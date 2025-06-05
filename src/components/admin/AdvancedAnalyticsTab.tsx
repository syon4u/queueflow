
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import PredictiveAnalytics from './analytics/PredictiveAnalytics';
import { PredictiveSchedulingDashboard } from './PredictiveSchedulingDashboard';
import { QueueOptimizationDashboard } from './QueueOptimizationDashboard';
import { CustomerSatisfactionAnalytics } from './CustomerSatisfactionAnalytics';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart,
  Brain,
  Calendar,
  Zap,
  Star
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
        <h2 className="text-2xl font-bold mb-2">Advanced Analytics & AI Optimization</h2>
        <p className="text-muted-foreground">
          Deep insights, predictive analytics, AI-powered scheduling, customer satisfaction, and real-time queue optimization
        </p>
      </div>

      <Tabs defaultValue="predictive" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Predictive Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Scheduling</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Queue Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="satisfaction" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Customer Satisfaction</span>
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
        
        <TabsContent value="optimization" className="space-y-4">
          <QueueOptimizationDashboard />
        </TabsContent>
        
        <TabsContent value="satisfaction" className="space-y-4">
          <CustomerSatisfactionAnalytics />
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
