
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Bell, HelpCircle, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

export const AdminTopNavigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const getInitials = (email: string) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-bc-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Broward QueuePro</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search locations, staff, appointments..."
              className="pl-10 pr-4 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-bc-blue"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h4 className="font-medium">Notifications</h4>
              </div>
              <div className="p-2">
                <div className="space-y-2">
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm font-medium">New appointment scheduled</p>
                    <p className="text-xs text-gray-500">Downtown location - 2 minutes ago</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm font-medium">Staff member on break</p>
                    <p className="text-xs text-gray-500">Sarah Johnson - 5 minutes ago</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm font-medium">Queue threshold reached</p>
                    <p className="text-xs text-gray-500">North Branch - 12 minutes ago</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-3 gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs bg-bc-blue text-white">
                    {getInitials(user?.email || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.email || 'Admin'}</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
