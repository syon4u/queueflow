
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  template_used?: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface CommunicationAnalyticsProps {
  communications: CommunicationHistory[];
  dateRange?: { from?: Date; to?: Date };
}

export const CommunicationAnalytics: React.FC<CommunicationAnalyticsProps> = ({
  communications,
  dateRange
}) => {
  const totalCommunications = communications.length;
  const emailCount = communications.filter(c => c.type === 'email').length;
  const smsCount = communications.filter(c => c.type === 'sms').length;
  const sentCount = communications.filter(c => c.status === 'sent').length;
  const failedCount = communications.filter(c => c.status === 'failed').length;
  const pendingCount = communications.filter(c => c.status === 'pending').length;

  const successRate = totalCommunications > 0 ? (sentCount / totalCommunications) * 100 : 0;
  const failureRate = totalCommunications > 0 ? (failedCount / totalCommunications) * 100 : 0;

  // Get most used templates
  const templateUsage = communications.reduce((acc, comm) => {
    if (comm.template_used) {
      acc[comm.template_used] = (acc[comm.template_used] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topTemplates = Object.entries(templateUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Get staff activity
  const staffActivity = communications.reduce((acc, comm) => {
    if (comm.staff) {
      const staffName = `${comm.staff.first_name} ${comm.staff.last_name}`;
      acc[staffName] = (acc[staffName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topStaff = Object.entries(staffActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  if (totalCommunications === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No communication data available for analysis</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-2xl font-bold">{totalCommunications}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</p>
            </div>
            <div className="flex items-center">
              {successRate >= 90 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Emails</p>
              <p className="text-2xl font-bold text-blue-600">{emailCount}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">SMS</p>
              <p className="text-2xl font-bold text-green-600">{smsCount}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Sent</span>
            </div>
            <Badge variant="default">{sentCount}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Failed</span>
            </div>
            <Badge variant="destructive">{failedCount}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium">Pending</span>
            </div>
            <Badge variant="secondary">{pendingCount}</Badge>
          </div>
        </div>
      </Card>

      {/* Top Templates and Staff Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Used Templates</h3>
          {topTemplates.length > 0 ? (
            <div className="space-y-3">
              {topTemplates.map(([template, count]) => (
                <div key={template} className="flex items-center justify-between">
                  <span className="text-sm">{template}</span>
                  <Badge variant="outline">{count} uses</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No template data available</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Active Staff</h3>
          {topStaff.length > 0 ? (
            <div className="space-y-3">
              {topStaff.map(([staff, count]) => (
                <div key={staff} className="flex items-center justify-between">
                  <span className="text-sm">{staff}</span>
                  <Badge variant="outline">{count} messages</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No staff activity data available</p>
          )}
        </Card>
      </div>
    </div>
  );
};
