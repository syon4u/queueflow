
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { QueueProvider } from '@/context/QueueContext';
import { useStaffNotifications } from '@/hooks/useStaffNotifications';
import { StaffSidebar } from '@/components/layout/StaffSidebar';
import { StaffMainContent } from '@/components/staff/StaffMainContent';
import StaffShortcuts from '@/components/staff/StaffShortcuts';
import { useAppData } from '@/hooks/useAppData';

const StaffPageContent = () => {
  const { user, role } = useAuth();
  const { appointments, refetch: refreshAppointments, isLoading } = useAppData();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('basic-queue');
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  
  // Enable staff notifications
  useStaffNotifications();

  // Filter to only show active appointments (not completed or cancelled)
  const activeAppointments = appointments.filter(
    (appointment) => !['completed', 'cancelled', 'no_show'].includes(appointment.status)
  );

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
    console.log('Notification center clicked');
  };

  const handleSettingsClick = () => {
    setShowShortcutsDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex justify-center items-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <StaffSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          notificationCount={0}
        />
        
        <SidebarInset className="flex-1">
          <StaffMainContent
            activeSection={activeSection}
            activeAppointments={activeAppointments}
            onRefresh={handleRefresh}
            onNotificationClick={handleNotificationClick}
            onSettingsClick={handleSettingsClick}
            onStatusChange={handleStatusChange}
          />
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
