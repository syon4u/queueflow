
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
  Calendar, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface RoleSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  notificationCount?: number;
  userRole?: 'staff' | 'employee' | 'admin';
}

export const RoleSidebar: React.FC<RoleSidebarProps> = ({
  activeSection,
  onSectionChange,
  notificationCount = 0,
  userRole = 'staff'
}) => {
  const { user, role } = useAuth();
  const { t } = useTranslation();

  const navigationItems = [
    {
      id: 'basic-queue',
      label: 'Queue Overview',
      icon: LayoutDashboard,
      badge: null,
      roles: ['staff', 'employee', 'admin']
    },
    {
      id: 'enhanced-queue',
      label: 'Queue Management',
      icon: Users,
      badge: null,
      roles: ['staff', 'employee', 'admin']
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: null,
      roles: ['staff', 'employee', 'admin']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
      roles: ['staff', 'employee', 'admin']
    },
    {
      id: 'advanced-tools',
      label: 'Advanced Tools',
      icon: Settings,
      badge: null,
      roles: ['staff', 'employee', 'admin']
    }
  ];

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getInitials = (email: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const getRoleDisplayName = (userRole: string, role: string) => {
    if (role === 'admin') return t('admin.role');
    if (userRole === 'employee') return 'Employee';
    return t('staff.role');
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
            {getInitials(user?.email || '')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">
              {getRoleDisplayName(userRole, role || '')}
            </p>
          </div>
          {notificationCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {notificationCount}
            </Badge>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/performance" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>{t('performance.reports')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>{t('admin.dashboard')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
