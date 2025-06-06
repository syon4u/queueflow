
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SimpleScheduleCard from '@/components/customer/SimpleScheduleCard';
import AppointmentConfirmationDialog from '@/components/customer/AppointmentConfirmationDialog';
import PageLayout from '@/components/layout/PageLayout';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { useCustomerAppointmentFlow } from '@/hooks/customer/useCustomerAppointmentFlow';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';
import { useAppData } from '@/hooks/useAppData';

const CustomerPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const { toast } = useToast();
  const { createAppointment, isSubmitting } = useCustomerAppointmentFlow();
  const { locations, services, appointments, isLoading } = useAppData();

  const handleAppointmentRequested = async (customerInfo: CustomerAppointmentData) => {
    console.log('CustomerPage - Processing appointment request:', customerInfo);
    
    try {
      const code = await createAppointment(customerInfo);
      
      if (code) {
        setConfirmationCode(code);
        setShowConfirmation(true);
        
        toast({
          title: 'Appointment Scheduled!',
          description: `Your appointment has been scheduled successfully. Confirmation code: ${code}`,
        });
      }
    } catch (error) {
      console.error('CustomerPage - Error creating appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayout 
        headerTitle="Consumer Protection Division"
        headerSubtitle="Schedule appointments and manage your visits"
      >
        <div className="min-h-screen bg-pattern-grid bg-gradient-overlay-teal">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

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
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            {/* Main appointment form takes up full width */}
            <div className="transition-all hover:translate-y-[-2px] duration-300">
              <SimpleScheduleCard onAppointmentRequested={handleAppointmentRequested} />
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
