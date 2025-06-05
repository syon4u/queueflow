
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Clock,
  Users,
  Target
} from 'lucide-react';

export const ReportsAnalyticsTab: React.FC = () => {
  // Mock data
  const reports = [
    { id: '1', name: 'Daily Attendance Report', description: 'Customer visit patterns and attendance metrics', lastRun: '2 hours ago' },
    { id: '2', name: 'Wait Time Analysis', description: 'Service wait times and efficiency metrics', lastRun: '1 day ago' },
    { id: '3', name: 'Service Performance', description: 'Individual service metrics and completion rates', lastRun: '3 days ago' },
    { id: '4', name: 'Staff Productivity', description: 'Staff performance and workload distribution', lastRun: '1 week ago' },
  ];

  const metrics = [
    { label: 'Today\'s Visitors', value: '127', change: '+12%', trend: 'up' },
    { label: 'Avg Wait Time', value: '14 min', change: '-8%', trend: 'down' },
    { label: 'Completion Rate', value: '94%', change: '+3%', trend: 'up' },
    { label: 'Customer Satisfaction', value: '4.7/5', change: '+0.2', trend: 'up' },
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">View performance metrics and export detailed reports</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export All Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-3 w-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Today's Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Appointments Completed</span>
                  <span className="font-medium">42/48</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Walk-ins Served</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>No-shows</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Service Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>License Renewals</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vehicle Registration</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other Services</span>
                  <span className="font-medium">18</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Peak Hours</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>10:00 AM - 11:00 AM</span>
                  <span className="font-medium">Busiest</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2:00 PM - 3:00 PM</span>
                  <span className="font-medium">Peak</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>4:00 PM - 5:00 PM</span>
                  <span className="font-medium">Moderate</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded">
                <div className="flex-1">
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Last run: {report.lastRun}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
