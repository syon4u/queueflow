
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Users, Target } from 'lucide-react';

interface PerformanceMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface PerformanceMetricsCardProps {
  metrics: PerformanceMetric[];
}

const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ metrics }) => {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <p className="text-3xl font-bold">
                  {metric.value}
                </p>
                <p className={`text-xs ${getTrendColor(metric.trend)} flex items-center gap-1`}>
                  <TrendingUp className="h-3 w-3" />
                  {metric.change}
                </p>
              </div>
              <div className="text-muted-foreground">
                {metric.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceMetricsCard;
