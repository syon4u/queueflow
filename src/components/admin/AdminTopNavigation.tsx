
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Wrench, 
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
    <div className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <div className="flex space-x-2 py-4 min-w-max">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`
                    flex items-center gap-2 whitespace-nowrap transition-all duration-200
                    ${isActive 
                      ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' 
                      : 'text-slate-800 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                    }
                    px-4 py-2.5 rounded-lg font-medium
                  `}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
