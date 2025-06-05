
import React from 'react';
import { PowerUserDashboard } from '@/components/power-user/PowerUserDashboard';
import { AppLayout } from '@/components/layout/AppLayout';
import { PowerUserSidebar } from '@/components/layout/PowerUserSidebar';

const PowerUserPage = () => {
  return (
    <AppLayout sidebar={<PowerUserSidebar />}>
      <PowerUserDashboard />
    </AppLayout>
  );
};

export default PowerUserPage;
