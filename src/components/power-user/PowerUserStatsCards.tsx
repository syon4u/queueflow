
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  MapPin, 
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react';

export const PowerUserStatsCards: React.FC = () => {
  // Mock data - in real implementation these would come from hooks
  const stats = {
    todayAppointments: 42,
    activeUsers: 156,
    activeLocations: 8,
    pendingMessages: 5,
    avgWaitTime: 12,
    completionRate: 94
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Today's Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{stats.todayAppointments}</div>
          <p className="text-xs text-blue-600 mt-1">Scheduled today</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Active Users</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{stats.activeUsers}</div>
          <p className="text-xs text-green-600 mt-1">System-wide</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Active Locations</CardTitle>
          <MapPin className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{stats.activeLocations}</div>
          <p className="text-xs text-purple-600 mt-1">Service centers</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Pending Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{stats.pendingMessages}</div>
          <p className="text-xs text-orange-600 mt-1">Awaiting delivery</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-yellow-800">Avg Wait Time</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900">{stats.avgWaitTime}m</div>
          <p className="text-xs text-yellow-600 mt-1">This week</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-teal-800">Completion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-900">{stats.completionRate}%</div>
          <p className="text-xs text-teal-600 mt-1">This month</p>
        </CardContent>
      </Card>
    </div>
  );
};
