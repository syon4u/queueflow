
import React from 'react';
import { 
  LayoutDashboard, 
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  Activity
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
      label: 'Queue Management',
      items: [
        {
          id: 'queue',
          label: 'Queue Control',
          icon: Activity,
          description: 'Manage active queues'
        }
      ]
    },
    {
      label: 'Analytics & Communication',
      items: [
        {
          id: 'stats',
          label: 'Reports',
          icon: BarChart3,
          description: 'Performance analytics'
        },
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
      icon: Activity,
      onClick: () => window.open('/power-user', '_blank'),
      iconColor: 'text-green-600'
    },
    {
      label: 'Performance',
      icon: BarChart3,
      onClick: () => window.open('/performance', '_blank'),
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <BaseSidebar
      title="Admin Portal"
      subtitle="Broward QueuePro"
      userRole="Administrator"
      navigationGroups={navigationGroups}
      quickActions={quickActions}
      activeItem={activeTab}
      onItemChange={onTabChange}
    />
  );
};
