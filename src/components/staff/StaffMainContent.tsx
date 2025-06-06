
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
import { AdvancedStaffTab } from '@/components/staff/AdvancedStaffTab';
import { StaffDashboardHeader } from '@/components/staff/StaffDashboardHeader';
import { StaffDashboardSkeleton } from '@/components/staff/StaffDashboardSkeleton';
import { StaffStatusSkeleton } from '@/components/staff/StaffStatusSkeleton';
import StaffStatusSection from '@/components/staff/StaffStatusSection';
import { CustomerSearchTab } from './CustomerSearchTab';
import { DemoDataControls } from '@/components/demo/DemoDataControls';

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

  // Get staff status from profiles table with better error handling
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['profile-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching profile status for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle to avoid errors when no data found
      
      if (error) {
        console.error('Error fetching profile status:', error);
        // Return default status instead of throwing
        return { status: 'active' };
      }
      
      console.log('Profile status fetched:', data);
      return data || { status: 'active' };
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
    retry: (failureCount, error) => {
      // Don't retry if it's a permissions error
      if (error?.message?.includes('permission')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const staffStatus = profileData?.status || 'active';

  // Log any profile query errors
  if (profileError) {
    console.error('Profile status query error:', profileError);
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case 'basic-queue':
        return (
          <div className="space-y-6">
            {/* Demo Data Controls - Only show in development */}
            {process.env.NODE_ENV === 'development' && (
              <DemoDataControls />
            )}
            
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

      case 'customer-search':
        return <CustomerSearchTab />;

      case 'advanced-tools':
        return <AdvancedStaffTab />;

      default:
        return null;
    }
  };

  // Show skeleton loading for staff dashboard when profile data is loading
  if (activeSection === 'basic-queue' && isProfileLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <StaffDashboardSkeleton />
        </div>
        <div className="bg-white border rounded-lg p-4">
          <StaffStatusSkeleton />
        </div>
        <div className="space-y-6">
          {renderMainContent()}
        </div>
      </div>
    );
  }

  // Show header and status section only on basic-queue tab
  if (activeSection === 'basic-queue') {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <StaffDashboardHeader
            queueStatus={queueStatus}
            staffStatus={staffStatus as 'active' | 'inactive'}
            activeAppointments={activeAppointments.length}
            onRefresh={onRefresh}
            onNotificationClick={onNotificationClick}
            onSettingsClick={onSettingsClick}
          />
        </div>

        <div className="bg-white border rounded-lg p-4">
          <StaffStatusSection onStatusChange={onStatusChange} />
        </div>

        {renderMainContent()}
      </div>
    );
  }
  
  // For all other sections, just render the content
  return renderMainContent();
};
