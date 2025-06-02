
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRealtimeAppointments } from '@/hooks/use-realtime-appointments';
import StaffAppointmentTable from '@/components/StaffAppointmentTable';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { QueueProvider, useQueue } from '@/context/QueueContext';
import QueueHeader from '@/components/QueueHeader';
import QueueStats from '@/components/QueueStats';
import CustomerQueue from '@/components/CustomerQueue';
import QueueControls from '@/components/QueueControls';
import AddCustomerForm from '@/components/AddCustomerForm';
import EstimatedWaitTimes from '@/components/EstimatedWaitTimes';
import StaffPerformanceReport from '@/components/staff/StaffPerformanceReport';
import { QueueManagementTab } from '@/components/staff/QueueManagementTab';
import { useStaffNotifications } from '@/hooks/useStaffNotifications';
import { AdvancedStaffTab } from '@/components/staff/AdvancedStaffTab';
import { StaffSidebar } from '@/components/layout/StaffSidebar';
import { StaffDashboardHeader } from '@/components/staff/StaffDashboardHeader';
import StaffStatusSection from '@/components/staff/StaffStatusSection';
import StaffShortcuts from '@/components/staff/StaffShortcuts';

const StaffPageContent = () => {
  const { user, role } = useAuth();
  const { appointments, isLoading: loading, refreshAppointments } = useRealtimeAppointments();
  const { stats } = useQueue();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('basic-queue');
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  
  // Enable staff notifications
  useStaffNotifications();

  // Debug logging for StaffPage
  console.log('StaffPage - appointments from useRealtimeAppointments:', appointments);
  console.log('StaffPage - appointments count:', appointments.length);
  console.log('StaffPage - stats from useQueue:', stats);
  console.log('StaffPage - stats.waitingCustomers:', stats.waitingCustomers);
  
  // Filter to only show active appointments (not completed or cancelled)
  const activeAppointments = appointments.filter(
    (appointment) => {
      const isActive = !['completed', 'cancelled', 'no_show'].includes(appointment.status);
      console.log(`StaffPage - Appointment ${appointment.id} status: ${appointment.status}, isActive: ${isActive}`);
      return isActive;
    }
  );

  console.log('StaffPage - activeAppointments:', activeAppointments);
  console.log('StaffPage - activeAppointments count:', activeAppointments.length);
  
  const handleStatusChange = () => {
    console.log('StaffPage - handleStatusChange called');
    refreshAppointments();
  };

  const handleRefresh = () => {
    console.log('StaffPage - handleRefresh called');
    refreshAppointments();
  };

  const handleNotificationClick = () => {
    // Handle notification center
    console.log('Notification center clicked');
  };

  const handleSettingsClick = () => {
    setShowShortcutsDialog(true);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'basic-queue':
        return (
          <div className="space-y-6">
            <QueueStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CustomerQueue />
                <EstimatedWaitTimes />
              </div>
              <div className="space-y-6">
                <QueueControls />
                <AddCustomerForm />
              </div>
            </div>
          </div>
        );

      case 'enhanced-queue':
        return <QueueManagementTab />;

      case 'appointments':
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Active Appointments ({activeAppointments.length})</h2>
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
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
        return <StaffPerformanceReport />;

      case 'advanced-tools':
        return <AdvancedStaffTab />;

      default:
        return null;
    }
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <StaffSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          notificationCount={0}
        />
        
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="bg-white border-b p-6">
              <StaffDashboardHeader
                queueStatus="open"
                staffStatus="active"
                activeAppointments={activeAppointments.length}
                onRefresh={handleRefresh}
                onNotificationClick={handleNotificationClick}
                onSettingsClick={handleSettingsClick}
              />
            </div>

            {/* Status Section */}
            <div className="bg-white border-b px-6 py-4">
              <StaffStatusSection onStatusChange={handleStatusChange} />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {renderMainContent()}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
      
      {/* Keyboard shortcuts dialog */}
      <StaffShortcuts 
        open={showShortcutsDialog} 
        onClose={() => setShowShortcutsDialog(false)} 
      />
    </SidebarProvider>
  );
};

const StaffPage = () => {
  return (
    <QueueProvider>
      <StaffPageContent />
    </QueueProvider>
  );
};

export default StaffPage;
