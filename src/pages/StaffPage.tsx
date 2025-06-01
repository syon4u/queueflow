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
import { PieChart } from 'lucide-react';
import { useStaffNotifications } from '@/hooks/useStaffNotifications';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';

const StaffPage = () => {
  const { user, role } = useAuth();
  const { appointments, loading, refreshAppointments } = useAppointments();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('queue');
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
    <BrowardLayout headerTitle="Staff Portal">
      <BrowardHero 
        title="Staff Dashboard" 
        subtitle="Manage appointments, queue, and staff settings"
        backgroundStyle="wave"
      />
      
      <div className="container mx-auto px-4 py-6">
        <StaffStatusSection onStatusChange={handleStatusChange} />
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} mb-6`}>
            <TabsTrigger value="queue">{t('staff.queueManagement')}</TabsTrigger>
            <TabsTrigger value="appointments">{t('staff.appointments')}</TabsTrigger>
            <TabsTrigger value="stats">{t('staff.statistics')}</TabsTrigger>
            <TabsTrigger value="settings">{t('staff.settings')}</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-6">
              <TabsContent value="queue">
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
              
              <TabsContent value="appointments">
                <div className="bg-white rounded-lg dark:bg-neutral-100">
                  <h2 className="text-xl font-serif mb-4">{t('staff.activeAppointments')}</h2>
                  
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bc-blue" aria-label={t('common.loading')}></div>
                    </div>
                  ) : (
                    <StaffAppointmentTable 
                      appointments={activeAppointments} 
                      onStatusChange={handleStatusChange}
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="stats">
                <StaffPerformanceReport />
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="bg-white rounded-lg dark:bg-neutral-100">
                  <h2 className="text-xl font-serif mb-4">{t('staff.settings')}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400">{t('staff.settingsDescription')}</p>
                </div>
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
      </div>
      
      {/* Keyboard shortcuts dialog */}
      <StaffShortcuts 
        open={showShortcutsDialog} 
        onClose={() => setShowShortcutsDialog(false)} 
      />
    </BrowardLayout>
  );
};

export default StaffPage;