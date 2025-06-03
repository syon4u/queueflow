
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
  LayoutDashboard, 
  Users, 
  Building2,
  FileText,
  UsersRound,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Contact,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
          label: 'Queue Configuration',
          icon: UsersRound,
          description: 'Manage active queues'
        },
        {
          id: 'locations',
          label: 'Location Management',
          icon: Building2,
          description: 'Service centers and facilities'
        },
        {
          id: 'services',
          label: 'Services & Appointments',
          icon: FileText,
          description: 'Available services configuration'
        }
      ]
    },
    {
      label: 'User Management',
      items: [
        {
          id: 'users',
          label: 'Staff Management',
          icon: Users,
          description: 'Staff accounts and permissions'
        },
        {
          id: 'customers',
          label: 'Customer Management',
          icon: Contact,
          description: 'Customer profiles and history'
        }
      ]
    },
    {
      label: 'Communication & Reports',
      items: [
        {
          id: 'templates',
          label: 'Notifications & Templates',
          icon: MessageSquare,
          description: 'Message templates and settings'
        },
        {
          id: 'stats',
          label: 'Reports & Analytics',
          icon: BarChart3,
          description: 'Performance insights and reports'
        }
      ]
    },
    {
      label: 'System',
      items: [
        {
          id: 'security',
          label: 'Security & Monitoring',
          icon: Shield,
          description: 'System security metrics'
        },
        {
          id: 'settings',
          label: 'System Settings',
          icon: Settings,
          description: 'Global configuration'
        }
      ]
    }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getInitials = (email: string) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  return (
    <Sidebar className="border-r bg-white w-72">
      <SidebarHeader className="p-6 border-b bg-gradient-to-r from-bc-blue to-bc-teal">
        <div className="text-white">
          <h2 className="text-lg font-semibold mb-1">Admin Control Center</h2>
          <p className="text-sm text-blue-100">Broward QueuePro Management</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className={`
                        w-full justify-start p-3 rounded-lg transition-all duration-200
                        ${activeTab === item.id 
                          ? 'bg-bc-blue text-white shadow-md' 
                          : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        }
                      `}
                    >
                      <item.icon className={`h-5 w-5 mr-3 ${
                        activeTab === item.id ? 'text-white' : 'text-gray-500'
                      }`} />
                      <div className="flex-1 text-left">
                        <div className={`font-medium text-sm ${
                          activeTab === item.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          activeTab === item.id ? 'text-blue-100' : 'text-gray-500'
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

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/staff" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Staff Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/admin/health" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">System Health</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border">
          <div className="h-8 w-8 rounded-full bg-bc-blue flex items-center justify-center text-white text-sm font-semibold">
            {getInitials(user?.email || '')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            Online
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
