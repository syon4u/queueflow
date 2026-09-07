
import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare,
  Settings,
  Shield
} from 'lucide-react';
import { BaseSidebar } from './BaseSidebar';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const navigationGroups = [
    {
      label: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          description: 'System overview and metrics'
        }
      ]
    },
    {
      label: 'Communication',
      items: [
        {
          id: 'communication',
          label: 'Templates',
          icon: MessageSquare,
          description: 'Message templates'
        }
      ]
    },
    {
      label: 'System',
      items: [
        {
          id: 'security',
          label: 'Security',
          icon: Shield,
          description: 'Security monitoring'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          description: 'System configuration'
        }
      ]
    }
  ];

  const quickActions = [
    {
      label: 'Power User Portal',
      icon: LayoutDashboard,
      onClick: () => window.open('/power-user', '_blank'),
      iconColor: 'text-green-600'
    }
  ];

  return (
    <BaseSidebar
      title="Admin Portal"
      subtitle="QueueFlow"
      userRole="Administrator"
      navigationGroups={navigationGroups}
      quickActions={quickActions}
      activeItem={activeTab}
      onItemChange={onTabChange}
    />
  );
};
