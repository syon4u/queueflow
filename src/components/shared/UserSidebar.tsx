
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Users, BarChart3, Settings, Calendar, MessageSquare, Clock, Bell, User } from 'lucide-react';

interface UserSidebarProps {
  userType: 'staff' | 'employee';
  activeSection: string;
  onSectionChange: (section: string) => void;
  notificationCount?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: number;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  userType,
  activeSection,
  onSectionChange,
  notificationCount = 0
}) => {
  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        id: 'basic-queue',
        label: 'Queue Management',
        icon: Users,
        description: 'Manage customer queue'
      },
      {
        id: 'performance',
        label: 'Performance',
        icon: BarChart3,
        description: 'View performance metrics'
      },
      {
        id: 'communication',
        label: 'Communication',
        icon: MessageSquare,
        description: 'Customer communications'
      }
    ];

    if (userType === 'employee') {
      return [
        ...baseItems,
        {
          id: 'schedule',
          label: 'Schedule',
          icon: Calendar,
          description: 'View work schedule'
        },
        {
          id: 'break-management',
          label: 'Break Management',
          icon: Clock,
          description: 'Request breaks'
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          description: 'Manage profile'
        }
      ];
    }

    return [
      ...baseItems,
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        description: 'View notifications',
        badge: notificationCount > 0 ? notificationCount : undefined
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        description: 'Application settings'
      }
    ];
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <h2 className="text-lg font-semibold">
          {userType === 'staff' ? 'Staff Dashboard' : 'Employee Portal'}
        </h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onSectionChange(item.id)}
                isActive={activeSection === item.id}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
