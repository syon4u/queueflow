
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Building2, UserCog, UserCheck } from 'lucide-react';

interface StatsOverviewCardsProps {
  staffStats: {
    total: number;
    active: number;
    admin: number;
    staff: number;
    locations: number;
  };
  userStats: {
    admin: number;
    staff: number;
    customer: number;
    total: number;
  };
}

export const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({
  staffStats,
  userStats
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Active Staff</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{staffStats.active}</div>
          <p className="text-xs text-blue-600 mt-1">of {staffStats.total} total</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Staff Admins</CardTitle>
          <Shield className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{staffStats.admin}</div>
          <p className="text-xs text-purple-600 mt-1">Admin privileges</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Service Locations</CardTitle>
          <Building2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{staffStats.locations}</div>
          <p className="text-xs text-green-600 mt-1">Active centers</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">All Users</CardTitle>
          <UserCog className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{userStats.total}</div>
          <p className="text-xs text-orange-600 mt-1">System-wide</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-teal-800">Customers</CardTitle>
          <UserCheck className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-900">{userStats.customer}</div>
          <p className="text-xs text-teal-600 mt-1">Service users</p>
        </CardContent>
      </Card>
    </div>
  );
};
