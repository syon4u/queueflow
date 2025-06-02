
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Settings, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/navigation/Breadcrumb';

interface StaffDashboardHeaderProps {
  queueStatus: 'open' | 'closed';
  staffStatus: 'active' | 'on_break' | 'inactive';
  activeAppointments: number;
  waitingCustomers: number;
  onRefresh: () => void;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}

export const StaffDashboardHeader: React.FC<StaffDashboardHeaderProps> = ({
  queueStatus,
  staffStatus,
  activeAppointments,
  waitingCustomers,
  onRefresh,
  onNotificationClick,
  onSettingsClick
}) => {
  const { t } = useTranslation();

  // Debug logging for StaffDashboardHeader
  console.log('StaffDashboardHeader - waitingCustomers prop:', waitingCustomers);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on_break':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'closed':
      case 'inactive':
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
          { label: 'Staff Dashboard', isActive: true }
        ]}
        className="mb-4"
      />

      {/* Header with status and actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('staff.dashboard')}</h1>
          <p className="text-gray-600 mt-1">{t('staff.managementDescription')}</p>
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
                <p className="text-sm font-medium text-gray-600">Queue Status</p>
                <Badge className={`mt-1 ${getStatusColor(queueStatus)}`}>
                  {queueStatus === 'open' ? 'Open' : 'Closed'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Status</p>
                <Badge className={`mt-1 ${getStatusColor(staffStatus)}`}>
                  {staffStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{activeAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waiting Customers</p>
                <p className="text-2xl font-bold text-amber-600">{waitingCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
