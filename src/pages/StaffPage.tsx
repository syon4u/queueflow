
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/hooks/use-appointments';
import StaffAppointmentTable from '@/components/StaffAppointmentTable';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffHeader from '@/components/staff/StaffHeader';
import StaffStatusSection from '@/components/staff/StaffStatusSection';
import StaffQueueSection from '@/components/staff/StaffQueueSection';
import StaffShortcuts from '@/components/staff/StaffShortcuts';
import { QueueProvider } from '@/context/QueueContext';
import QueueHeader from '@/components/QueueHeader';
import QueueStats from '@/components/QueueStats';
import CustomerQueue from '@/components/CustomerQueue';
import QueueControls from '@/components/QueueControls';
import AddCustomerForm from '@/components/AddCustomerForm';
import EstimatedWaitTimes from '@/components/EstimatedWaitTimes';
import StaffPerformanceReport from '@/components/staff/StaffPerformanceReport';
import { QueueManagementTab } from '@/components/staff/QueueManagementTab';
import { PieChart } from 'lucide-react';
import { useStaffNotifications } from '@/hooks/useStaffNotifications';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { AdvancedStaffTab } from '@/components/staff/AdvancedStaffTab';

const StaffPage = () => {
  const { user, role } = useAuth();
  const { appointments, loading, refreshAppointments } = useAppointments();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('basic-queue');
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  
  // Enable staff notifications
  useStaffNotifications();
  
  // Filter to only show active appointments (not completed or cancelled)
  const activeAppointments = appointments.filter(
    (appointment) => !['completed', 'cancelled', 'no_show'].includes(appointment.status)
  );
  
  const handleStatusChange = () => {
    refreshAppointments();
  };

  const toggleShortcutsDialog = () => {
    setShowShortcutsDialog(prev => !prev);
  };
  
  return (
    <div className="min-h-screen bg-pattern-dots bg-gradient-overlay-blue">
      <StaffHeader 
        user={user} 
        role={role}
        onToggleShortcuts={toggleShortcutsDialog}
      />
      
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { label: 'Staff Dashboard', isActive: true }
            ]}
            className="mb-4"
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('staff.dashboard')}</h1>
              <p className="text-gray-600">{t('staff.managementDescription')}</p>
            </div>
          </div>
        </div>

        <StaffStatusSection onStatusChange={handleStatusChange} />
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'}`}>
              <TabsTrigger value="basic-queue">Basic Queue</TabsTrigger>
              <TabsTrigger value="enhanced-queue">Enhanced Queue</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="advanced-tools">Advanced Tools</TabsTrigger>
            </TabsList>
            
            {/* Performance Reports button - now positioned next to tabs */}
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/performance">
                <PieChart className="h-4 w-4" />
                {t('performance.reports')}
              </Link>
            </Button>
          </div>
          
          <Card className="bg-white/90 backdrop-filter backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <TabsContent value="basic-queue">
                <QueueProvider>
                  <div className="space-y-6">
                    <QueueStats />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="space-y-6">
                          <CustomerQueue />
                          <EstimatedWaitTimes />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <QueueControls />
                        <AddCustomerForm />
                      </div>
                    </div>
                  </div>
                </QueueProvider>
              </TabsContent>

              <TabsContent value="enhanced-queue">
                <QueueManagementTab />
              </TabsContent>
              
              <TabsContent value="appointments">
                <div className="bg-white rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Active Appointments</h2>
                  
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-label={t('common.loading')}></div>
                    </div>
                  ) : (
                    <StaffAppointmentTable 
                      appointments={activeAppointments} 
                      onStatusChange={handleStatusChange}
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <StaffPerformanceReport />
              </TabsContent>
              
              <TabsContent value="advanced-tools">
                <AdvancedStaffTab />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        
        <div className="flex space-x-4 mt-6">
          {role === 'admin' && (
            <Button asChild variant="outline">
              <Link to="/admin">{t('admin.dashboard')}</Link>
            </Button>
          )}
        </div>
      </main>
      
      {/* Keyboard shortcuts dialog */}
      <StaffShortcuts 
        open={showShortcutsDialog} 
        onClose={() => setShowShortcutsDialog(false)} 
      />
    </div>
  );
};

export default StaffPage;
