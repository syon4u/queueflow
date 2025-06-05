
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  Search, 
  Calendar,
  Clock,
  User,
  Edit,
  X,
  Check
} from 'lucide-react';

export const AppointmentOverridesTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock appointment data requiring overrides
  const pendingOverrides = [
    { 
      id: '1', 
      customer: 'John Doe', 
      service: 'License Renewal', 
      originalTime: '2024-06-05 10:00 AM',
      requestedTime: '2024-06-05 2:00 PM',
      reason: 'Medical emergency',
      priority: 'high',
      status: 'pending'
    },
    { 
      id: '2', 
      customer: 'Jane Smith', 
      service: 'Vehicle Registration', 
      originalTime: '2024-06-06 9:00 AM',
      requestedTime: '2024-06-07 11:00 AM',
      reason: 'Work conflict',
      priority: 'medium',
      status: 'pending'
    },
    { 
      id: '3', 
      customer: 'Bob Wilson', 
      service: 'Title Transfer', 
      originalTime: '2024-06-05 3:00 PM',
      requestedTime: 'Walk-in request',
      reason: 'Special accommodation needed',
      priority: 'high',
      status: 'pending'
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Appointment Overrides</h2>
          <p className="text-sm text-gray-500">Review and manage special booking requests and schedule changes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <X className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Overrides */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pending Override Requests</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingOverrides.map((request) => (
              <div key={request.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{request.customer}</h4>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority} priority
                      </Badge>
                      <Badge variant="outline">{request.service}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Original Appointment</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {request.originalTime}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Requested Change</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {request.requestedTime}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modify
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Override Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Emergency Booking
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Extend Hours
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <User className="h-6 w-6 mb-2" />
              VIP Priority
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
