
import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatWaitTime } from '@/lib/queue';

const QueueStats: React.FC = () => {
  const { stats } = useQueue();

  const statItems = [
    {
      label: 'Waiting',
      value: stats.waitingCustomers,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Average Wait',
      value: formatWaitTime(stats.averageWaitTime),
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Served',
      value: stats.servedCustomers,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      label: 'No-Shows',
      value: stats.noShowCustomers,
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      color: 'text-red-700', 
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card key={index} className={`border-l-4 border-l-primary ${item.bgColor}`}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className={`text-2xl font-semibold ${item.color}`}>
                {typeof item.value === 'number' ? item.value : item.value}
              </p>
            </div>
            <div className="bg-background rounded-full p-3">{item.icon}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QueueStats;
