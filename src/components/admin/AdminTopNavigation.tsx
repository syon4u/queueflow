
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  MessageSquare, Settings, Shield, Phone, GitMerge, TrendingUp, Gauge, Zap, Stethoscope, BarChart3,
} from 'lucide-react';

interface AdminTopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Horizontal tab strip for the admin portal. Every id here must have a
 * matching <TabsContent value="..."> in AdminPage. The sidebar only exposes a
 * handful of top-level sections; this strip is how admins reach the rest
 * (capacity, throttling, SMS, analytics, health check, ...).
 */
export const AdminTopNavigation: React.FC<AdminTopNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'advanced-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'capacity-management', label: 'Capacity', icon: Gauge },
    { id: 'capacity-throttling', label: 'Throttling', icon: Zap },
    { id: 'sms-commands', label: 'SMS Commands', icon: Phone },
    { id: 'queue-flow-2', label: 'Queue Flow 2.0', icon: GitMerge },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backend-health', label: 'Health Check', icon: Stethoscope },
  ];

  return (
    <div className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full whitespace-nowrap">
          <nav aria-label="Admin sections" className="flex items-center gap-1 py-2">
            {navigationItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <Button
                  key={id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onTabChange(id)}
                  className={cn(
                    'gap-2 rounded-md',
                    isActive
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              );
            })}
          </nav>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};
