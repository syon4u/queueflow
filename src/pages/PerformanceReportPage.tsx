
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffPerformanceReport from '@/components/staff/StaffPerformanceReport';
import StaffHeader from '@/components/staff/StaffHeader';
import { useTranslation } from 'react-i18next';

const PerformanceReportPage: React.FC = () => {
  const { user, role } = useAuth();
  const { t } = useTranslation();
  
  // Check if user has appropriate role to view performance metrics
  const hasAccess = role === 'admin' || role === 'staff';

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[90%] max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-center mb-4">{t('unauthorized.title')}</h2>
            <p className="text-center text-muted-foreground">{t('unauthorized.description')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffHeader user={user} role={role} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('performance.dashboardTitle')}</h1>
          <p className="text-gray-600">{t('performance.dashboardDescription')}</p>
        </div>
        
        <Tabs defaultValue="staff" className="space-y-4">
          <TabsList>
            <TabsTrigger value="staff">{t('performance.staffPerformance')}</TabsTrigger>
            <TabsTrigger value="services">{t('performance.serviceMetrics')}</TabsTrigger>
            <TabsTrigger value="locations">{t('performance.locationMetrics')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="space-y-4">
            <StaffPerformanceReport />
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <p className="p-4 text-muted-foreground">{t('performance.comingSoon')}</p>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-4">
            <p className="p-4 text-muted-foreground">{t('performance.comingSoon')}</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PerformanceReportPage;
