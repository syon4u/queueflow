
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SimpleScheduleCard from '@/components/customer/SimpleScheduleCard';
import AppointmentConfirmationDialog from '@/components/customer/AppointmentConfirmationDialog';
import PageLayout from '@/components/layout/PageLayout';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAppointmentForm } from '@/hooks/customer/useEnhancedAppointmentForm';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';
import { Search, Calendar, QrCode, Clock } from 'lucide-react';

const CustomerPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const { toast } = useToast();
  const { createAppointmentWithValidation, isSubmitting } = useEnhancedAppointmentForm();

  console.log('CustomerPage rendered');

  const handleAppointmentRequested = async (customerInfo: CustomerAppointmentData) => {
    console.log('Processing appointment request:', customerInfo);
    
    try {
      const code = await createAppointmentWithValidation(customerInfo);
      
      if (code) {
        setConfirmationCode(code);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment. Please try again.',
        variant: 'destructive',
      });
    }
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link to="/appointment-lookup" className="transition-all hover:translate-y-[-2px] duration-300">
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <Search className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Find Appointment</h3>
                    <p className="text-sm text-gray-600">View or cancel existing appointments</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/status" className="transition-all hover:translate-y-[-2px] duration-300">
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Check Status</h3>
                    <p className="text-sm text-gray-600">See your queue position</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <QrCode className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">QR Scan</h3>
                  <p className="text-sm text-gray-600">Quick appointment lookup</p>
                </div>
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
