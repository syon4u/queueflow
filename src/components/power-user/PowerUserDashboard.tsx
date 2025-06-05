
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  ClipboardList,
  Settings,
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
  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Power User Portal', isActive: true }
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Power User Portal</h1>
          <p className="text-gray-600 mt-1">Comprehensive management tools and day-to-day operations</p>
        </div>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Management Dashboard
          </CardTitle>
          <CardDescription>
            Access all management tools and operational features in one unified interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gray-100">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Locations
              </TabsTrigger>
              <TabsTrigger value="communications" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="overrides" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Overrides
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
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

            <TabsContent value="settings">
              <div className="space-y-6 mt-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Power User Settings</h2>
                  <p className="text-sm text-gray-500">Configure your power user preferences and settings</p>
                </div>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-6">
                    <p className="text-gray-600">Settings panel coming soon. This will include notification preferences, default views, and operational settings.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
