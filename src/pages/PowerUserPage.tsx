
import React, { useState } from 'react';
import { PowerUserDashboard } from '@/components/power-user/PowerUserDashboard';
import { AppLayout } from '@/components/layout/AppLayout';
import { PowerUserSidebar } from '@/components/layout/PowerUserSidebar';
import { useAppData } from '@/hooks/useAppData';

const PowerUserPage = () => {
  // Warm the small public lists; tabs that need the appointments table fetch it on mount.
  const { isLoading } = useAppData({ appointments: false });
  const [activeSection, setActiveSection] = useState('dashboard');

  // Sync sidebar navigation with dashboard tabs
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  if (isLoading) {
    return (
      <AppLayout sidebar={<PowerUserSidebar activeItem={activeSection} onItemChange={handleSectionChange} />}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout sidebar={<PowerUserSidebar activeItem={activeSection} onItemChange={handleSectionChange} />}>
      <PowerUserDashboard 
        activeTab={activeSection} 
        onTabChange={handleSectionChange}
      />
    </AppLayout>
  );
};

export default PowerUserPage;
