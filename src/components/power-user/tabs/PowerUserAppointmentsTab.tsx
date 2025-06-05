
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Users, Clock } from 'lucide-react';

export const PowerUserAppointmentsTab: React.FC = () => {
  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Today's Appointments & Operations</h2>
          <p className="text-sm text-gray-500">Manage appointments, check-ins, and customer interactions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Driver's License Renewal</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">9:00 AM</p>
                  <p className="text-xs text-green-600">Checked In</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">Vehicle Registration</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">9:30 AM</p>
                  <p className="text-xs text-blue-600">Scheduled</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Currently Waiting</span>
                <span className="font-medium">7 customers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Being Served</span>
                <span className="font-medium">3 customers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Available</span>
                <span className="font-medium">2:15 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Performance Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium">15 appointments</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Service Time</span>
                <span className="font-medium">12 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="font-medium">4.7/5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Check In Customer
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              View Queue
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Add Walk-in
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Schedule Follow-up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
