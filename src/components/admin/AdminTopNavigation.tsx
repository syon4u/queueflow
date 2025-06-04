
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Wrench, 
  UserCheck,
  MessageSquare,
  Settings,
  Shield,
  Phone,
  GitMerge,
  TrendingUp,
  Gauge,
  Zap,
  Activity,
  Stethoscope
} from 'lucide-react';

interface AdminTopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminTopNavigation: React.FC<AdminTopNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'staff', label: 'Staff', icon: UserCheck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'queue', label: 'Queue', icon: Activity },
    { id: 'advanced-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'capacity-management', label: 'Capacity', icon: Gauge },
    { id: 'capacity-throttling', label: 'Throttling', icon: Zap },
    { id: 'sms-commands', label: 'SMS Commands', icon: Phone },
    { id: 'queue-flow-2', label: 'Queue Flow 2.0', icon: GitMerge },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backend-health', label: 'Health Check', icon: Stethoscope }
  ];

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <div className="flex space-x-1 py-2 min-w-max">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
