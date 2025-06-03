
import React, { useState } from 'react';
import { Search, Bell, HelpCircle, User, Users, Phone, Calendar, BarChart3, Clock, MessageSquare, Edit, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueue } from '@/context/QueueContext';
import { useAuth } from '@/context/AuthContext';

export const ModernAdminLayout: React.FC = () => {
  const { user } = useAuth();
  const { customers, stats, callNextCustomer, markAsServed } = useQueue();
  const [searchQuery, setSearchQuery] = useState('');

  const waitingCustomers = customers.filter(c => c.status === 'waiting');
  const todayAppointments = 12; // Mock data
  const notifications = [
    { id: 1, message: "Jonathan Hall has checked in", time: "2 min ago", type: "checkin" },
    { id: 2, message: "Appointment reminder: Sarah Wilson at 3:30 PM", time: "15 min ago", type: "reminder" },
    { id: 3, message: "New appointment scheduled for tomorrow", time: "1 hour ago", type: "appointment" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Queue Manager</h1>
              <p className="text-sm text-slate-500">Admin Portal</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                placeholder="Search customers, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-100">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </Button>
            <Avatar className="w-10 h-10 border-2 border-slate-200">
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Queue Stats Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white/90 text-sm font-medium">People in Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">{stats.waitingCustomers}</div>
              <Button
                onClick={callNextCustomer}
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md"
                disabled={waitingCustomers.length === 0}
              >
                <Phone className="w-5 h-5 mr-2" />
                Summon Next
              </Button>
            </CardContent>
          </Card>

          {/* Today's Summary */}
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Appointments</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">{todayAppointments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Served</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">{stats.servedCustomers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">No Shows</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700">{stats.noShowCustomers}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="h-full shadow-md border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Currently Waiting ({waitingCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {waitingCustomers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No customers waiting</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {waitingCustomers.map((customer, index) => (
                      <div
                        key={customer.id}
                        className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-700 font-semibold">#{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">{customer.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {Math.floor((new Date().getTime() - customer.joinedAt.getTime()) / 60000)}m wait
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {customer.service}
                                </Badge>
                                {customer.priority === 'priority' && (
                                  <Badge className="bg-amber-100 text-amber-800 text-xs">Priority</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700">
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-slate-100">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-slate-100">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Notifications Feed */}
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700 mb-1">{notification.message}</p>
                  <p className="text-xs text-slate-500">{notification.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Panel - Tab Navigation */}
      <div className="mt-8 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-[1600px] mx-auto">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="w-full bg-transparent border-b border-slate-200 rounded-none h-auto p-0">
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-8 py-4"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Today's Appointments
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-8 py-4"
              >
                <Users className="w-4 h-4 mr-2" />
                Customer History
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-8 py-4"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="p-6">
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Today's appointments will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="p-6">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Customer history will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="p-6">
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Reports and analytics will be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
