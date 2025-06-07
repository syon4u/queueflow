
import React from 'react';
import { 
  Users, 
  Calendar,
  Settings,
  Activity,
  Search
} from 'lucide-react';
import { BaseSidebar } from './BaseSidebar';

interface StaffSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  notificationCount?: number;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({
  activeSection,
  onSectionChange,
  notificationCount = 0
}) => {
  const navigationGroups = [
    {
      label: 'Queue Management',
      items: [
        {
          id: 'basic-queue',
          label: 'Queue Dashboard',
          icon: Activity,
          description: 'Main queue operations'
        },
        {
          id: 'enhanced-queue',
          label: 'Enhanced Queue',
          icon: Users,
          description: 'Advanced queue management'
        }
      ]
    },
    {
      label: 'Appointments & Customers',
      items: [
        {
          id: 'appointments',
          label: 'Appointments',
          icon: Calendar,
          description: 'Manage appointments'
        },
        {
          id: 'customer-search',
          label: 'Customer Search',
          icon: Search,
          description: 'Search and view customer history'
        }
      ]
    }
  ];

  const quickActions = [
    {
      label: 'Admin Portal',
      icon: Settings,
      onClick: () => window.open('/admin', '_blank'),
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <BaseSidebar
      title="Staff Portal"
      subtitle="Broward QueuePro"
      userRole="Staff Member"
      navigationGroups={navigationGroups}
      quickActions={quickActions}
      activeItem={activeSection}
      onItemChange={onSectionChange}
    />
  );
};
