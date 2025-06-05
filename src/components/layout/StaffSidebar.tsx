
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Activity,
  Wrench,
  Search,
  Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();
  const { t } = useTranslation();

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
    },
    {
      label: 'Analytics & Tools',
      items: [
        {
          id: 'analytics',
          label: 'Performance',
          icon: BarChart3,
          description: 'Staff performance metrics'
        },
        {
          id: 'advanced-tools',
          label: 'Advanced Tools',
          icon: Wrench,
          description: 'Additional staff tools'
        }
      ]
    }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getInitials = (email: string) => {
    if (!email) return 'S';
    return email.charAt(0).toUpperCase();
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4 border-b bg-gradient-to-r from-bc-blue to-bc-teal">
        <div className="text-white">
          <h2 className="text-lg font-semibold mb-1">Staff Portal</h2>
          <p className="text-sm text-blue-100">Broward QueuePro</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-4">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className={`
                        w-full justify-start p-3 rounded-lg transition-all duration-200 group
                        ${activeSection === item.id 
                          ? 'bg-bc-blue text-white shadow-sm' 
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        }
                      `}
                    >
                      <item.icon className={`h-4 w-4 mr-3 flex-shrink-0 ${
                        activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                      <div className="flex-1 text-left min-w-0">
                        <div className={`font-medium text-sm truncate ${
                          activeSection === item.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-xs mt-0.5 truncate ${
                          activeSection === item.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => window.open('/admin', '_blank')}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">Admin Portal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => window.open('/performance', '_blank')}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Performance Report</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border shadow-sm">
          <div className="h-8 w-8 rounded-full bg-bc-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {getInitials(user?.email || '')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">Staff Member</p>
          </div>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
            Online
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
