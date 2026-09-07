
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, MapPin, Wrench, TrendingUp } from 'lucide-react';
import { usePowerUserStats } from '@/hooks/power-user/usePowerUserStats';

export const PowerUserStatsCards: React.FC = () => {
  const { data: stats, isLoading, error } = usePowerUserStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading statistics</p>
        </CardContent>
      </Card>
    );
  }

  const statsConfig = [
    {
      title: "Today's Appointments",
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      description: "Scheduled today (local day), any status",
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: Users,
      description: "Currently active",
      color: "text-green-600"
    },
    {
      title: "Locations",
      value: stats?.totalLocations || 0,
      icon: MapPin,
      description: "Service locations",
      color: "text-purple-600"
    },
    {
      title: "Services",
      value: stats?.totalServices || 0,
      icon: Wrench,
      description: "Available services",
      color: "text-orange-600"
    },
    {
      title: "Completion Rate",
      value: `${stats?.completionRate || 0}%`,
      icon: TrendingUp,
      description: "Served today / scheduled today",
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statsConfig.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
