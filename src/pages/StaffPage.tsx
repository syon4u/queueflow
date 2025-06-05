
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRealtimeAppointments } from '@/hooks/use-realtime-appointments';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { QueueProvider } from '@/context/QueueContext';
import { useStaffNotifications } from '@/hooks/useStaffNotifications';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { StaffMainContent } from '@/components/staff/StaffMainContent';
import StaffShortcuts from '@/components/staff/StaffShortcuts';

const StaffPageContent = () => {
  const { user, role } = useAuth();
  const { appointments, refreshAppointments } = useRealtimeAppointments();
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          notificationCount={0}
          userRole="staff"
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
