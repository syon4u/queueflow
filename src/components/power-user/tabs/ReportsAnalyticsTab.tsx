
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Download, Calendar, Users, Clock, Target, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const ReportsAnalyticsTab: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7d');
  const [reportType, setReportType] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('appointments');

  // Mock data for charts
  const appointmentTrends = [
    { date: '2024-01-01', appointments: 45, completed: 42, cancelled: 3 },
    { date: '2024-01-02', appointments: 52, completed: 48, cancelled: 4 },
    { date: '2024-01-03', appointments: 38, completed: 35, cancelled: 3 },
    { date: '2024-01-04', appointments: 61, completed: 58, cancelled: 3 },
    { date: '2024-01-05', appointments: 47, completed: 44, cancelled: 3 },
    { date: '2024-01-06', appointments: 55, completed: 52, cancelled: 3 },
    { date: '2024-01-07', appointments: 49, completed: 46, cancelled: 3 },
  ];

  const serviceDistribution = [
    { name: 'General Inquiry', value: 35, color: '#3B82F6' },
    { name: 'Document Review', value: 25, color: '#10B981' },
    { name: 'Application Support', value: 20, color: '#F59E0B' },
    { name: 'Information Update', value: 15, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' },
  ];

  const performanceMetrics = [
    { location: 'Main Office', avgWait: 12, satisfaction: 4.5, throughput: 85 },
    { location: 'Downtown', avgWait: 15, satisfaction: 4.2, throughput: 78 },
    { location: 'Northside', avgWait: 10, satisfaction: 4.7, throughput: 92 },
    { location: 'Westside', avgWait: 18, satisfaction: 4.0, throughput: 72 },
  ];

  const stats = {
    totalAppointments: 1247,
    completionRate: 94.2,
    avgWaitTime: 14,
    customerSatisfaction: 4.4,
    staffUtilization: 82,
    noShowRate: 5.8,
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will be downloaded shortly",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${reportType} report for ${timeRange} has been generated`,
    });
  };

  const handleScheduleReport = () => {
    toast({
      title: "Schedule Report",
      description: "Report scheduling dialog would open here",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into system performance and operational metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScheduleReport}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview Report</SelectItem>
            <SelectItem value="performance">Performance Report</SelectItem>
            <SelectItem value="customer">Customer Analytics</SelectItem>
            <SelectItem value="staff">Staff Performance</SelectItem>
            <SelectItem value="operational">Operational Metrics</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleGenerateReport} variant="outline">
          Generate Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalAppointments}</p>
              </div>
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900">{stats.completionRate}%</p>
              </div>
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Avg Wait Time</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.avgWaitTime}m</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Satisfaction</p>
                <p className="text-2xl font-bold text-purple-900">{stats.customerSatisfaction}/5</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 mb-1">Staff Utilization</p>
                <p className="text-2xl font-bold text-indigo-900">{stats.staffUtilization}%</p>
              </div>
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">No-Show Rate</p>
                <p className="text-2xl font-bold text-red-900">{stats.noShowRate}%</p>
              </div>
              <div className="w-6 h-6 bg-red-600 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointment Trends */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Appointment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="cancelled" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Service Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Location Performance Metrics</CardTitle>
            <Badge variant="outline">{performanceMetrics.length} locations</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Location</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Avg Wait Time</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Satisfaction</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Throughput</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {performanceMetrics.map((metric, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{metric.location}</td>
                    <td className="py-4 px-6 text-gray-600">{metric.avgWait} min</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{metric.satisfaction}/5</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(metric.satisfaction) ? 'bg-yellow-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{metric.throughput}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${metric.throughput}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant="outline" 
                        className={
                          metric.throughput >= 85 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : metric.throughput >= 75 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {metric.throughput >= 85 ? 'Excellent' : metric.throughput >= 75 ? 'Good' : 'Needs Attention'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
