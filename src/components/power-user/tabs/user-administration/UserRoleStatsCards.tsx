
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, UserCheck } from 'lucide-react';

interface RoleStats {
  admin: number;
  power_user: number;
  staff: number;
  customer: number;
}

interface UserRoleStatsCardsProps {
  roleStats: RoleStats;
}

export const UserRoleStatsCards: React.FC<UserRoleStatsCardsProps> = ({ roleStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Administrators</p>
              <p className="text-3xl font-bold text-red-900">{roleStats.admin}</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Power Users</p>
              <p className="text-3xl font-bold text-purple-900">{roleStats.power_user}</p>
            </div>
            <UserCheck className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Staff Members</p>
              <p className="text-3xl font-bold text-blue-900">{roleStats.staff}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Customers</p>
              <p className="text-3xl font-bold text-gray-900">{roleStats.customer}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
