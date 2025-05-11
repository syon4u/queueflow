
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import StaffHeader from '@/components/staff/StaffHeader';
import StaffPerformanceReport from '@/components/staff/StaffPerformanceReport';
import Unauthorized from '@/pages/Unauthorized';

const PerformanceReportPage = () => {
  const { t } = useTranslation();
  const { user, role } = useAuth();

  // Only staff or admin can access this page
  if (!user || (role !== 'staff' && role !== 'admin')) {
    return <Unauthorized />;
  }

  return (
    <div className="container mx-auto p-6">
      <StaffHeader 
        user={user} 
        role={role}
        onToggleShortcuts={() => {}} // Add empty function for the missing prop
      />
      
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('performance.dashboardTitle')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('performance.dashboardDescription')}
        </p>
        
        <StaffPerformanceReport />
      </div>
    </div>
  );
};

export default PerformanceReportPage;
