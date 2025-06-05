
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/shared/UserSidebar';
import { UserManagementTab } from '@/components/shared/UserManagementTab';

interface UserManagementPageProps {
  userType?: 'staff' | 'employee';
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ 
  userType = 'staff' 
}) => {
  const { user, role } = useAuth();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('user-management');

  // Determine page configuration based on userType
  const pageConfig = {
    staff: {
      title: 'Staff Management',
      breadcrumbLabel: 'Staff Management',
      sidebarType: 'staff' as const
    },
    employee: {
      title: 'Employee Management', 
      breadcrumbLabel: 'Employee Management',
      sidebarType: 'employee' as const
    }
  };

  const config = pageConfig[userType];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'user-management':
        return (
          <UserManagementTab
            userType={userType}
            title={config.title}
            breadcrumbLabel={config.breadcrumbLabel}
          />
        );
      default:
        return (
          <UserManagementTab
            userType={userType}
            title={config.title}
            breadcrumbLabel={config.breadcrumbLabel}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <UserSidebar
          userType={config.sidebarType}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderMainContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default UserManagementPage;
