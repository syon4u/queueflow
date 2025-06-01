import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ScheduleAppointmentCard from '@/components/customer/ScheduleAppointmentCard';
import CheckInCard from '@/components/customer/CheckInCard';
import AppointmentStatusCard from '@/components/customer/AppointmentStatusCard';
import WaitTimesCard from '@/components/customer/WaitTimesCard';
import AppointmentConfirmationDialog from '@/components/customer/AppointmentConfirmationDialog';
import QueuePositionTracker from '@/components/customer/QueuePositionTracker';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardCard from '@/components/ui/broward-card';

const CustomerPage = () => {
  const { user, role } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleAppointmentScheduled = (code: string) => {
    setConfirmationCode(code);
    setShowConfirmation(true);
  };

  return (
    <BrowardLayout headerTitle="Customer Portal">
      <BrowardHero 
        title="Customer Portal" 
        subtitle="Schedule appointments or check your status"
        backgroundStyle="pattern"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="transition-all hover:translate-y-[-2px] duration-300">
            <BrowardCard title="Schedule an Appointment" elevation="md">
              <ScheduleAppointmentCard onAppointmentScheduled={handleAppointmentScheduled} />
            </BrowardCard>
          </div>
          
          <div className="space-y-6">
            <div className="transition-all hover:translate-y-[-2px] duration-300">
              <BrowardCard title="Your Queue Position" elevation="md">
                <QueuePositionTracker />
              </BrowardCard>
            </div>
            <div className="transition-all hover:translate-y-[-2px] duration-300">
              <BrowardCard title="Check In" elevation="md">
                <CheckInCard />
              </BrowardCard>
            </div>
            <div className="transition-all hover:translate-y-[-2px] duration-300">
              <BrowardCard title="Appointment Status" elevation="md">
                <AppointmentStatusCard />
              </BrowardCard>
            </div>
            <div className="transition-all hover:translate-y-[-2px] duration-300">
              <BrowardCard title="Current Wait Times" elevation="md">
                <WaitTimesCard />
              </BrowardCard>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Confirmation Dialog */}
      <AppointmentConfirmationDialog 
        open={showConfirmation} 
        onOpenChange={setShowConfirmation} 
        confirmationCode={confirmationCode} 
      />
    </BrowardLayout>
  );
};

export default CustomerPage;