
import React from 'react';
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
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  iconColor: string;
}

interface BaseSidebarProps {
  title: string;
  subtitle: string;
  userRole: string;
  navigationGroups: NavigationGroup[];
  quickActions: QuickAction[];
  activeItem: string;
  onItemChange: (item: string) => void;
}

export const BaseSidebar: React.FC<BaseSidebarProps> = ({
  title,
  subtitle,
  userRole,
  navigationGroups,
  quickActions,
  activeItem,
  onItemChange
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getInitials = (email: string) => {
    if (!email) return userRole.charAt(0).toUpperCase();
    return email.charAt(0).toUpperCase();
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4 border-b bg-gradient-to-r from-bc-blue to-bc-teal">
        <div className="text-white">
          <h2 className="text-lg font-semibold mb-1">{title}</h2>
          <p className="text-sm text-blue-100">{subtitle}</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-4">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onItemChange(item.id)}
                      isActive={activeItem === item.id}
                      className={`
                        w-full justify-start p-3 rounded-lg transition-all duration-200 group
                        ${activeItem === item.id 
                          ? 'bg-bc-blue text-white shadow-sm' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }
                      `}
                    >
                      <item.icon className={`h-4 w-4 mr-3 flex-shrink-0 ${
                        activeItem === item.id ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                      }`} />
                      <div className="flex-1 text-left min-w-0">
                        <div className={`font-medium text-sm truncate ${
                          activeItem === item.id ? 'text-white' : 'text-foreground'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-xs mt-0.5 truncate ${
                          activeItem === item.id ? 'text-blue-100' : 'text-muted-foreground'
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
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {quickActions.map((action, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    onClick={action.onClick}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <action.icon className={`h-4 w-4 ${action.iconColor} flex-shrink-0`} />
                    <span className="text-sm">{action.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-muted/50">
        <div className="flex items-center gap-3 mb-3 p-3 bg-background rounded-lg border shadow-sm">
          <div className="h-8 w-8 rounded-full bg-bc-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {getInitials(user?.email || '')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
            Online
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
