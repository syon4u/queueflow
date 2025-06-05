
import React from 'react';
import { Shield, Users, UserCheck, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StaffStats {
  total: number;
  active: number;
  locations: number;
}

interface UserStats {
  admin: number;
  staff: number;
  customer: number;
  total: number;
}

interface UserManagementStatsProps {
  staffStats: StaffStats;
  userStats: UserStats;
}

export const UserManagementStats: React.FC<UserManagementStatsProps> = ({ 
  staffStats, 
  userStats 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Total Staff</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{staffStats.total}</div>
          <p className="text-xs text-blue-600 mt-1">{staffStats.active} active members</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Locations</CardTitle>
          <Building2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{staffStats.locations}</div>
          <p className="text-xs text-green-600 mt-1">Service centers</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Administrators</CardTitle>
          <Shield className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{userStats.admin}</div>
          <p className="text-xs text-purple-600 mt-1">Full access users</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Total Users</CardTitle>
          <UserCheck className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{userStats.total}</div>
          <p className="text-xs text-orange-600 mt-1">All role types</p>
        </CardContent>
      </Card>
    </div>
  );
};
