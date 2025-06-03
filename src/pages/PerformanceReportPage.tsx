
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import DailyPerformanceChart from '@/components/staff/performance/DailyPerformanceChart';
import PerformanceHeader from '@/components/staff/performance/PerformanceHeader';
import ServiceMetricsCard from '@/components/staff/performance/ServiceMetricsCard';
import StaffPerformanceCard from '@/components/staff/performance/StaffPerformanceCard';
import SummaryMetrics from '@/components/staff/performance/SummaryMetrics';
import FeatureTrackingList from '@/components/admin/FeatureTrackingList';
import { ArrowLeft, Search, Bell, HelpCircle, BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import { useDailyMetrics, useServiceMetrics, useStaffMetrics } from '@/hooks/admin/use-performance-metrics';
import { TIME_PERIODS } from '@/components/staff/performance/constants';

const PerformanceReportPage = () => {
  const { t } = useTranslation();
  const { role, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');
  const [timeRange, setTimeRange] = useState('week');
  
  // Use the custom hooks for performance metrics
  const { data: staffMetrics, isLoading: staffLoading } = useStaffMetrics(timeRange);
  const { data: serviceMetrics, isLoading: serviceLoading } = useServiceMetrics(timeRange);
  const { data: dailyMetrics, isLoading: dailyLoading } = useDailyMetrics(timeRange);

  // Download report as CSV
  const downloadReportCSV = () => {
    // Combine all metrics data
    const combinedData = {
      staff: staffMetrics || [],
      services: serviceMetrics || [],
      daily: dailyMetrics || []
    };

    // Convert to CSV format
    const jsonString = JSON.stringify(combinedData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: 'Report Downloaded',
      description: 'Your performance report has been downloaded successfully.'
    });
  };
  
  // Loading states for queries
  const isLoading = staffLoading || serviceLoading || dailyLoading;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar - Matching Admin Portal Style */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center px-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Admin</span>
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-bc-blue flex items-center justify-center">
                <BarChart3 className="text-white h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">Performance Reports</h1>
                <p className="text-xs text-gray-500">Analytics & Insights</p>
              </div>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search reports, metrics..."
                className="pl-10 pr-4 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-bc-blue"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                2
              </Badge>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <div className="h-8 w-8 rounded-full bg-bc-blue flex items-center justify-center text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Performance Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Performance Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive insights into queue performance and staff efficiency
                  </CardDescription>
                </div>
                
                <PerformanceHeader 
                  timeRange={timeRange}
                  setTimeRange={setTimeRange}
                  isLoading={isLoading}
                  onDownload={downloadReportCSV}
                />
              </div>
            </CardHeader>
          </Card>
          
          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <Card>
              <CardHeader className="pb-3">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100">
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Summary</span>
                  </TabsTrigger>
                  <TabsTrigger value="staff" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Staff</span>
                  </TabsTrigger>
                  <TabsTrigger value="services" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Services</span>
                  </TabsTrigger>
                  <TabsTrigger value="daily" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Daily</span>
                  </TabsTrigger>
                  {role === 'admin' && (
                    <TabsTrigger value="features" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Features</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bc-blue"></div>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="summary" className="mt-0 space-y-6">
                        <SummaryMetrics 
                          dailyMetrics={dailyMetrics}
                          staffMetrics={staffMetrics}
                          serviceMetrics={serviceMetrics}
                        />
                      </TabsContent>
                      
                      <TabsContent value="staff" className="mt-0">
                        <StaffPerformanceCard staffMetrics={staffMetrics} />
                      </TabsContent>
                      
                      <TabsContent value="services" className="mt-0">
                        <ServiceMetricsCard serviceMetrics={serviceMetrics} />
                      </TabsContent>
                      
                      <TabsContent value="daily" className="mt-0">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                              Daily Performance Trends
                            </CardTitle>
                            <CardDescription>
                              Appointment volumes and wait times over time
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <DailyPerformanceChart dailyMetrics={dailyMetrics} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      {role === 'admin' && (
                        <TabsContent value="features" className="mt-0">
                          <FeatureTrackingList />
                        </TabsContent>
                      )}
                    </>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReportPage;
