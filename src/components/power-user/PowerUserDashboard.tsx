
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck
} from 'lucide-react';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { PowerUserStatsCards } from './PowerUserStatsCards';
import { UserAdministrationTab } from './tabs/UserAdministrationTab';
import { LocationsServicesTab } from './tabs/LocationsServicesTab';
import { SMSNotificationTab } from './tabs/SMSNotificationTab';
import { ReportsAnalyticsTab } from './tabs/ReportsAnalyticsTab';
import { AppointmentOverridesTab } from './tabs/AppointmentOverridesTab';
import { PowerUserAppointmentsTab } from './tabs/PowerUserAppointmentsTab';

interface PowerUserDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const PowerUserDashboard: React.FC<PowerUserDashboardProps> = ({ 
  activeTab,
  onTabChange
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'appointments':
        return <PowerUserAppointmentsTab />;
      case 'users':
        return <UserAdministrationTab />;
      case 'locations':
        return <LocationsServicesTab />;
      case 'communications':
        return <SMSNotificationTab />;
      case 'reports':
        return <ReportsAnalyticsTab />;
      case 'overrides':
        return <AppointmentOverridesTab />;
      default:
        return <PowerUserAppointmentsTab />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', isActive: true }
          ]}
          className="mb-0"
        />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Power User Access
          </Badge>
        </div>
      </div>

      {/* Stats Overview - Only show on dashboard tab */}
      {activeTab === 'dashboard' && <PowerUserStatsCards />}

      {/* Main Content */}
      <div className="space-y-6">
        {renderTabContent()}
      </div>
    </div>
  );
};
