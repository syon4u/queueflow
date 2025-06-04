
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Users,
  Target
} from 'lucide-react';

interface AnalyticsSummaryCardsProps {
  data?: {
    summary: {
      total_appointments: number;
      completion_rate: number;
      average_wait_time: number;
      average_service_time: number;
      customer_satisfaction: number;
    };
  };
}

const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({ data }) => {
  if (!data?.summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { summary } = data;

  const summaryCards = [
    {
      title: 'Total Appointments',
      value: summary.total_appointments?.toLocaleString() || '0',
      icon: Calendar,
      description: 'All scheduled appointments',
      trend: summary.total_appointments > 100 ? 'up' : 'neutral',
      color: 'blue'
    },
    {
      title: 'Completion Rate',
      value: `${summary.completion_rate?.toFixed(1) || '0'}%`,
      icon: CheckCircle,
      description: 'Successfully completed',
      trend: summary.completion_rate > 85 ? 'up' : summary.completion_rate < 70 ? 'down' : 'neutral',
      color: summary.completion_rate > 85 ? 'green' : summary.completion_rate < 70 ? 'red' : 'yellow'
    },
    {
      title: 'Avg Wait Time',
      value: `${summary.average_wait_time?.toFixed(1) || '0'} min`,
      icon: Clock,
      description: 'Time before service',
      trend: summary.average_wait_time < 15 ? 'up' : summary.average_wait_time > 30 ? 'down' : 'neutral',
      color: summary.average_wait_time < 15 ? 'green' : summary.average_wait_time > 30 ? 'red' : 'yellow'
    },
    {
      title: 'Avg Service Time',
      value: `${summary.average_service_time?.toFixed(1) || '0'} min`,
      icon: Target,
      description: 'Time to complete service',
      trend: 'neutral',
      color: 'blue'
    },
    {
      title: 'Customer Satisfaction',
      value: summary.customer_satisfaction ? `${summary.customer_satisfaction.toFixed(1)}/5` : 'N/A',
      icon: Star,
      description: 'Average rating',
      trend: summary.customer_satisfaction > 4 ? 'up' : summary.customer_satisfaction < 3 ? 'down' : 'neutral',
      color: summary.customer_satisfaction > 4 ? 'green' : summary.customer_satisfaction < 3 ? 'red' : 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50';
      case 'red':
        return 'text-red-600 bg-red-50';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50';
      case 'blue':
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${getColorClasses(card.color)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                {getTrendIcon(card.trend)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm font-medium text-gray-700">{card.title}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsSummaryCards;
