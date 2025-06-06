
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Settings, Shield, Phone, GitMerge, TrendingUp, Gauge, Zap, Stethoscope } from 'lucide-react';

interface AdminTopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminTopNavigation: React.FC<AdminTopNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: TrendingUp
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare
    },
    {
      id: 'capacity-management',
      label: 'Capacity',
      icon: Gauge
    },
    {
      id: 'capacity-throttling',
      label: 'Throttling',
      icon: Zap
    },
    {
      id: 'sms-commands',
      label: 'SMS Commands',
      icon: Phone
    },
    {
      id: 'queue-flow-2',
      label: 'Queue Flow 2.0',
      icon: GitMerge
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield
    },
    {
      id: 'backend-health',
      label: 'Health Check',
      icon: Stethoscope
    }
  ];

  return (
    <div className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          {/* Navigation items would go here if needed */}
        </ScrollArea>
      </div>
    </div>
  );
};
