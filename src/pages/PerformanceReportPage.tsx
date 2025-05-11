
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import DailyPerformanceChart from '@/components/staff/performance/DailyPerformanceChart';
import PerformanceHeader from '@/components/staff/performance/PerformanceHeader';
import ServiceMetricsCard from '@/components/staff/performance/ServiceMetricsCard';
import StaffPerformanceCard from '@/components/staff/performance/StaffPerformanceCard';
import SummaryMetrics from '@/components/staff/performance/SummaryMetrics';
import FeatureTrackingList from '@/components/admin/FeatureTrackingList';
import { ArrowLeft } from 'lucide-react';

const PerformanceReportPage = () => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const [activeTab, setActiveTab] = React.useState('summary');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <PerformanceHeader />
        
        {/* Main Content */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-5">
              <TabsTrigger value="summary">
                {t('performance.summary')}
              </TabsTrigger>
              <TabsTrigger value="staff">
                {t('performance.staff')}
              </TabsTrigger>
              <TabsTrigger value="services">
                {t('performance.services')}
              </TabsTrigger>
              <TabsTrigger value="daily">
                {t('performance.daily')}
              </TabsTrigger>
              {role === 'admin' && (
                <TabsTrigger value="features">
                  Feature Status
                </TabsTrigger>
              )}
            </TabsList>
            
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              <TabsContent value="summary" className="mt-0">
                <SummaryMetrics />
              </TabsContent>
              
              <TabsContent value="staff" className="mt-0">
                <StaffPerformanceCard />
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                <ServiceMetricsCard />
              </TabsContent>
              
              <TabsContent value="daily" className="mt-0">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t('performance.dailyActivity')}
                  </h2>
                  <DailyPerformanceChart />
                </Card>
              </TabsContent>
              
              {role === 'admin' && (
                <TabsContent value="features" className="mt-0">
                  <FeatureTrackingList />
                </TabsContent>
              )}
            </ScrollArea>
          </Tabs>
        </div>
        
        {/* Back button */}
        <div className="mt-6">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/staff">
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReportPage;
