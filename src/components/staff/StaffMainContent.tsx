
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueue } from '@/context/QueueContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import QueueStats from '@/components/QueueStats';
import CustomerQueue from '@/components/CustomerQueue';
import EstimatedWaitTimes from '@/components/EstimatedWaitTimes';
import QueueControls from '@/components/QueueControls';
import AddCustomerForm from '@/components/AddCustomerForm';
import { QueueManagementTab } from '@/components/staff/QueueManagementTab';
import EnhancedAppointmentTable from '@/components/staff/EnhancedAppointmentTable';
import StaffPerformanceReport from '@/components/staff/StaffPerformanceReport';
import { AdvancedStaffTab } from '@/components/staff/AdvancedStaffTab';
import { StaffDashboardHeader } from '@/components/staff/StaffDashboardHeader';
import StaffStatusSection from '@/components/staff/StaffStatusSection';

interface StaffMainContentProps {
  activeSection: string;
  activeAppointments: any[];
  onRefresh: () => void;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  onStatusChange: () => void;
}

export const StaffMainContent: React.FC<StaffMainContentProps> = ({
  activeSection,
  activeAppointments,
  onRefresh,
  onNotificationClick,
  onSettingsClick,
  onStatusChange
}) => {
  const { user } = useAuth();
  const { queueStatus } = useQueue();

  // Get staff status from database
  const { data: staffData } = useQuery({
    queryKey: ['staff-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('staff')
        .select('status, break_type, return_time')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching staff status:', error);
        return { status: 'inactive', break_type: null, return_time: null };
      }
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const staffStatus = staffData?.status || 'inactive';

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
        return <EnhancedAppointmentTable />;

      case 'analytics':
        return <StaffPerformanceReport />;

      case 'advanced-tools':
        return <AdvancedStaffTab />;

      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Only show on basic-queue tab (main staff dashboard) */}
      {activeSection === 'basic-queue' && (
        <>
          <div className="bg-white border-b p-6">
            <StaffDashboardHeader
              queueStatus={queueStatus}
              staffStatus={staffStatus as 'active' | 'on_break' | 'inactive'}
              activeAppointments={activeAppointments.length}
              onRefresh={onRefresh}
              onNotificationClick={onNotificationClick}
              onSettingsClick={onSettingsClick}
            />
          </div>

          {/* Status Section - Only show on basic-queue tab */}
          <div className="bg-white border-b px-6 py-4">
            <StaffStatusSection onStatusChange={onStatusChange} />
          </div>
        </>
      )}
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};
