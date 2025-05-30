
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CheckInCard from '@/components/customer/CheckInCard';
import QueuePositionTracker from '@/components/customer/QueuePositionTracker';
import WaitTimesCard from '@/components/customer/WaitTimesCard';
import ScheduleAppointmentCard from '@/components/customer/ScheduleAppointmentCard';
import AppointmentStatusCard from '@/components/customer/AppointmentStatusCard';

const CustomerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
          <p className="text-gray-600">Manage your appointments and check queue status</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <QueuePositionTracker />
          </div>
          
          <div className="space-y-6">
            <CheckInCard />
            <WaitTimesCard />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScheduleAppointmentCard />
          <AppointmentStatusCard />
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
