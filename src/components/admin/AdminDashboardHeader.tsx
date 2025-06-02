
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Settings, RefreshCw, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/navigation/Breadcrumb';

interface AdminDashboardHeaderProps {
  systemStatus: 'healthy' | 'warning' | 'error';
  totalUsers: number;
  activeStaff: number;
  todayAppointments: number;
  onRefresh: () => void;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  systemStatus,
  totalUsers,
  activeStaff,
  todayAppointments,
  onRefresh,
  onNotificationClick,
  onSettingsClick
}) => {
  const { t } = useTranslation();

  // Debug logging for AdminDashboardHeader
  console.log('AdminDashboardHeader - Props received:');
  console.log('AdminDashboardHeader - systemStatus:', systemStatus);
  console.log('AdminDashboardHeader - totalUsers:', totalUsers);
  console.log('AdminDashboardHeader - activeStaff:', activeStaff);
  console.log('AdminDashboardHeader - todayAppointments:', todayAppointments);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Admin Dashboard', isActive: true }
        ]}
        className="mb-4"
      />

      {/* Header with status and actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
            <p className="text-gray-600 mt-1">{t('admin.managementDescription')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onNotificationClick}>
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onSettingsClick}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <Badge className={`mt-1 ${getStatusColor(systemStatus)}`}>
                  {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-green-600">{activeStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-amber-600">{todayAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
