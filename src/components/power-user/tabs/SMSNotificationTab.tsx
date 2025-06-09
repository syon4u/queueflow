
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSMSStats } from '@/hooks/power-user/useSMSStats';
import { useToast } from '@/hooks/use-toast';

export const SMSNotificationTab: React.FC = () => {
  const { data: smsStats, isLoading, error, refetch } = useSMSStats();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const handleSendBulkNotification = () => {
    toast({
      title: 'Bulk Notification',
      description: 'Bulk notification system would open here'
    });
  };

  const handleCreateTemplate = () => {
    toast({
      title: 'Create Template',
      description: 'Template creation dialog would open here'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading SMS statistics</p>
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const dailyChartData = Object.entries(smsStats?.dailyStats || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, stats]) => ({
      date: new Date(date).toLocaleDateString(),
      sent: stats.sent || 0,
      failed: stats.failed || 0,
      pending: stats.pending || 0
    }));

  const templateData = Object.entries(smsStats?.templateUsage || {}).map(([template, count]) => ({
    template,
    count
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SMS & Notifications</h2>
          <p className="text-muted-foreground">
            Manage SMS communications and notification templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateTemplate} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button onClick={handleSendBulkNotification}>
            <Send className="h-4 w-4 mr-2" />
            Send Bulk SMS
          </Button>
        </div>
      </div>

      {/* SMS Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsStats?.totalSent || 0}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsStats?.successRate || 0}%</div>
            <p className="text-xs text-muted-foreground">{smsStats?.successful || 0} successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsStats?.failed || 0}</div>
            <p className="text-xs text-muted-foreground">{smsStats?.failureRate || 0}% failure rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsStats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">In queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily SMS Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Daily SMS Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#22c55e" strokeWidth={2} name="Sent" />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed" />
                <Line type="monotone" dataKey="pending" stroke="#eab308" strokeWidth={2} name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Template Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Template Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={templateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="template" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {smsStats?.templates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No SMS templates configured. Create your first template to get started.
              </p>
            ) : (
              smsStats?.templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {template.content.length > 100 
                        ? `${template.content.substring(0, 100)}...`
                        : template.content
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={template.is_active ? 'default' : 'secondary'}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {smsStats?.templateUsage[template.name] || 0} uses
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Communications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent SMS Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {smsStats?.communications.slice(0, 10).map((comm) => (
              <div key={comm.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="text-sm">{comm.message.substring(0, 50)}...</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comm.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant={
                  comm.status === 'sent' ? 'default' : 
                  comm.status === 'failed' ? 'destructive' : 'secondary'
                }>
                  {comm.status}
                </Badge>
              </div>
            ))}
            {smsStats?.communications.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No recent SMS communications
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
