
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ScheduleAppointmentCard from '@/components/customer/ScheduleAppointmentCard';
import CheckInCard from '@/components/customer/CheckInCard';
import AppointmentStatusCard from '@/components/customer/AppointmentStatusCard';
import WaitTimesCard from '@/components/customer/WaitTimesCard';
import AppointmentConfirmationDialog from '@/components/customer/AppointmentConfirmationDialog';

const CustomerPage = () => {
  const { user, role } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleAppointmentScheduled = (code: string) => {
    setConfirmationCode(code);
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Customer Portal</h1>
            <p className="text-muted-foreground">Schedule appointments or check your status</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Logged in as: {user?.email} (Role: {role || 'customer'})
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ScheduleAppointmentCard onAppointmentScheduled={handleAppointmentScheduled} />
          
          <div className="space-y-6">
            <CheckInCard />
            <AppointmentStatusCard />
            <WaitTimesCard />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      {/* Appointment Confirmation Dialog */}
      <AppointmentConfirmationDialog 
        open={showConfirmation} 
        onOpenChange={setShowConfirmation} 
        confirmationCode={confirmationCode} 
      />
    </div>
  );
};

export default CustomerPage;
