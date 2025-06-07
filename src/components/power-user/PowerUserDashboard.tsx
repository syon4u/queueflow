
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PowerUserStatsCards } from './PowerUserStatsCards';
import { PowerUserAppointmentsTab } from './tabs/PowerUserAppointmentsTab';
import { UserAdministrationTab } from './tabs/UserAdministrationTab';
import { LocationsServicesTab } from './tabs/LocationsServicesTab';
import { SMSNotificationTab } from './tabs/SMSNotificationTab';
import { ReportsAnalyticsTab } from './tabs/ReportsAnalyticsTab';
import { AppointmentOverridesTab } from './tabs/AppointmentOverridesTab';
import { AdvancedStaffTab } from '@/components/staff/AdvancedStaffTab';
import { 
  Home, 
  Calendar, 
  Users, 
  MapPin, 
  MessageSquare, 
  BarChart3, 
  ClipboardList,
  Wrench
} from 'lucide-react';

interface PowerUserDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const PowerUserDashboard: React.FC<PowerUserDashboardProps> = ({ 
  activeTab = 'dashboard',
  onTabChange 
}) => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Power User Portal</h2>
        <p className="text-muted-foreground">
          Comprehensive management tools and administrative controls
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Locations</span>
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">SMS</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="advanced-tools" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <PowerUserStatsCards />
          <PowerUserAppointmentsTab />
        </TabsContent>

        <TabsContent value="appointments">
          <PowerUserAppointmentsTab />
        </TabsContent>

        <TabsContent value="users">
          <UserAdministrationTab />
        </TabsContent>

        <TabsContent value="locations">
          <LocationsServicesTab />
        </TabsContent>

        <TabsContent value="communications">
          <SMSNotificationTab />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsAnalyticsTab />
        </TabsContent>

        <TabsContent value="overrides">
          <AppointmentOverridesTab />
        </TabsContent>

        <TabsContent value="advanced-tools">
          <AdvancedStaffTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
