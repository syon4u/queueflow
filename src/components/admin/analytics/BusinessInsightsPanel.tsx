import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Gauge, TrendingUp, TrendingDown, Minus, PieChart as PieChartIcon } from 'lucide-react';
import { useBusinessInsights } from '@/hooks/use-business-insights';

const PIE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const TrendBadge: React.FC<{ direction: 'up' | 'down' | 'flat' | null }> = ({ direction }) => {
  if (!direction) return null;
  if (direction === 'flat') {
    return (
      <Badge variant="secondary" className="gap-1">
        <Minus className="h-3 w-3" /> Stable
      </Badge>
    );
  }
  const isUp = direction === 'up';
  return (
    <Badge variant={isUp ? 'destructive' : 'success'} className="gap-1">
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isUp ? 'Wait times rising' : 'Wait times improving'}
    </Badge>
  );
};

/**
 * Business Insights tab content: lightweight, real-data-driven analytics
 * derived from actual appointment history (see useBusinessInsights). This is
 * intentionally a simple statistical estimator (rolling average), not a full
 * ML model — a low-risk, high-visibility upgrade over a "coming soon" stub.
 */
export const BusinessInsightsPanel: React.FC = () => {
  const insights = useBusinessInsights();
  const serviceTotal = insights.serviceShare.reduce((sum, entry) => sum + entry.value, 0);

  if (insights.isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 h-72">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!insights.hasData) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        <PieChartIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Business Insights Dashboard</p>
        <p className="text-sm mt-2">
          Insights populate automatically once appointments start moving through check-in and service.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Predicted wait-time estimator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="sm:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gauge className="h-4 w-4" /> Predicted Next Wait
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {insights.predictedNextWaitMinutes !== null ? `${insights.predictedNextWaitMinutes} min` : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Moving average of the last {Math.min(insights.sampleSize, 5)} completed visits
            </p>
            <div className="mt-3">
              <TrendBadge direction={insights.trendDirection} />
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Wait Time Trend</CardTitle>
            <CardDescription>Average wait per day, most recent activity</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.dailyWaitTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis fontSize={12} width={32} />
                <Tooltip formatter={(value: number) => [`${value} min`, 'Avg wait']} />
                <Line
                  type="monotone"
                  dataKey="avgWaitMinutes"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demand by Day of Week</CardTitle>
            <CardDescription>Appointment volume across the week</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.weekdayVolume}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} width={32} />
                <Tooltip />
                <Bar dataKey="volume" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Mix</CardTitle>
            <CardDescription>Share of appointments by service</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.serviceShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  labelLine={false}
                  label={false}
                >
                  {insights.serviceShare.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value} (${serviceTotal ? Math.round((value / serviceTotal) * 100) : 0}%)`, name]} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value: string, entry) => {
                    const v = (entry?.payload as { value?: number } | undefined)?.value ?? 0;
                    const pct = serviceTotal ? Math.round((v / serviceTotal) * 100) : 0;
                    return <span className="text-xs text-foreground">{value} · {pct}%</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessInsightsPanel;
