
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Star,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useStaffPerformance } from '@/hooks/use-staff-performance';
import { Button } from '@/components/ui/button';

export const PerformanceAnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { metrics, isLoading, refreshMetrics } = useStaffPerformance();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'break': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'break': return 'On Break';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshMetrics}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getStatusColor(metrics.currentWorkload.status)}`}></div>
              <span className="font-medium">{getStatusText(metrics.currentWorkload.status)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {metrics.currentWorkload.activeCustomers} active • {metrics.currentWorkload.queueLength} waiting
            </div>
            {metrics.currentWorkload.estimatedBacklog > 0 && (
              <Badge variant="outline">
                {metrics.currentWorkload.estimatedBacklog}m backlog
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers Served
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.todayStats.customersServed}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Service Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.todayStats.averageServiceTime}m</div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.todayStats.completionRate}%</div>
            <Progress value={metrics.todayStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              On-Time Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.todayStats.onTimePerformance}%</div>
            <Progress value={metrics.todayStats.onTimePerformance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Customers Served</span>
              <span className="text-lg font-bold">{metrics.weeklyStats.totalCustomersServed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Productivity Score</span>
              <div className="flex items-center gap-2">
                <Progress value={metrics.weeklyStats.productivityScore} className="w-16" />
                <span className="text-sm font-medium">{metrics.weeklyStats.productivityScore}/100</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                Average Rating
              </span>
              <span className="text-lg font-bold">{metrics.weeklyStats.averageRating}/5.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your busiest times this week:</p>
              <div className="flex flex-wrap gap-2">
                {metrics.weeklyStats.busyHours.map((hour, index) => (
                  <Badge key={index} variant="secondary">
                    {hour}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Consider these times for break planning
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
