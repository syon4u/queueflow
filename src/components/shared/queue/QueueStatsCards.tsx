
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueue } from '@/context/QueueContext';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

interface QueueStatsCardsProps {
  variant?: 'staff' | 'admin';
}

export const QueueStatsCards: React.FC<QueueStatsCardsProps> = ({ variant = 'staff' }) => {
  const { stats } = useQueue();

  const statsConfig = [
    {
      title: variant === 'admin' ? 'Total Customers' : 'Queue Length',
      value: variant === 'admin' ? stats.totalCustomers : stats.waitingCustomers,
      icon: Users,
      color: 'blue',
      description: variant === 'admin' ? 'All-time entries' : 'Currently waiting'
    },
    {
      title: 'Currently Waiting',
      value: stats.waitingCustomers,
      icon: Clock,
      color: 'orange',
      description: 'In queue now'
    },
    {
      title: 'Served Today',
      value: stats.servedCustomers,
      icon: CheckCircle,
      color: 'green',
      description: 'Successfully completed'
    },
    {
      title: 'No-Shows',
      value: stats.noShowCustomers,
      icon: XCircle,
      color: 'red',
      description: 'Missed appointments'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-800',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-800',
      red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-800'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const getIconColor = (color: string) => {
    const iconColorMap = {
      blue: 'text-blue-600',
      orange: 'text-orange-600',
      green: 'text-green-600',
      red: 'text-red-600'
    };
    return iconColorMap[color as keyof typeof iconColorMap];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statsConfig.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className={getColorClasses(stat.color)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${getIconColor(stat.color)}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs mt-1 opacity-75">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
