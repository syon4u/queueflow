
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SimpleScheduleCard from '@/components/customer/SimpleScheduleCard';
import CheckInCard from '@/components/customer/CheckInCard';
import AppointmentStatusCard from '@/components/customer/AppointmentStatusCard';
import WaitTimesCard from '@/components/customer/WaitTimesCard';
import AppointmentConfirmationDialog from '@/components/customer/AppointmentConfirmationDialog';
import QueuePositionTracker from '@/components/customer/QueuePositionTracker';
import PageLayout from '@/components/layout/PageLayout';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { useToast } from '@/hooks/use-toast';

const CustomerPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const { toast } = useToast();

  const handleAppointmentRequested = async (customerInfo: any) => {
    console.log('Customer appointment request:', customerInfo);
    
    // Generate a simple confirmation code
    const code = `REQ-${Date.now().toString().slice(-6)}`;
    setConfirmationCode(code);
    setShowConfirmation(true);
    
    // Here you would normally send this data to your backend
    // For now, we'll just log it and show success
    toast({
      title: 'Request Submitted!',
      description: `Your appointment request has been submitted. Reference: ${code}`,
    });
  };

  return (
    <PageLayout 
      headerTitle="Consumer Protection Division"
      headerSubtitle="Schedule appointments and manage your visits"
    >
      <div className="min-h-screen bg-pattern-grid bg-gradient-overlay-teal">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { label: 'Customer Portal', isActive: true }
              ]}
              className="mb-4"
            />
          </div>

          <div className="bg-image bg-image-overlay rounded-xl mb-8" 
               style={{ backgroundImage: "url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg')" }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
              <div>
                <h1 className="text-gradient text-3xl font-bold">Customer Portal</h1>
                <p className="text-muted-foreground mt-1">Request appointments and manage your visits</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-muted-foreground border border-border/40">
                Customer Services Portal
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main appointment form takes up 2 columns */}
            <div className="lg:col-span-2 transition-all hover:translate-y-[-2px] duration-300">
              <SimpleScheduleCard onAppointmentRequested={handleAppointmentRequested} />
            </div>
            
            {/* Side cards */}
            <div className="space-y-6">
              <div className="transition-all hover:translate-y-[-2px] duration-300">
                <QueuePositionTracker />
              </div>
              <div className="transition-all hover:translate-y-[-2px] duration-300">
                <CheckInCard />
              </div>
              <div className="transition-all hover:translate-y-[-2px] duration-300">
                <AppointmentStatusCard />
              </div>
              <div className="transition-all hover:translate-y-[-2px] duration-300">
                <WaitTimesCard />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button asChild variant="outline" className="shadow-sm border-gray-200 hover:bg-gray-50 transition-colors">
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
    </PageLayout>
  );
};

export default CustomerPage;
