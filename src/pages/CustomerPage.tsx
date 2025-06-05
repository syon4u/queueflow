
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
import { useCustomerAppointmentFlow } from '@/hooks/customer/useCustomerAppointmentFlow';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';
import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';

const CustomerPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const { toast } = useToast();
  const { createAppointment, isSubmitting } = useCustomerAppointmentFlow();
  const { locations, services, appointments, isLoading, error } = useAppData();

  // Filter today's appointments for stats
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(apt => 
    new Date(apt.scheduled_time).toDateString() === today
  );

  const queueStats = {
    waiting: appointments.filter(apt => apt.status === 'checked_in').length,
    inProgress: appointments.filter(apt => apt.status === 'in_progress').length,
    totalToday: todaysAppointments.length,
    activeLocations: locations.filter(loc => loc.queue_status === 'open').length,
  };

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
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-500 mt-4 ml-4 font-medium">Loading customer portal...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout 
        headerTitle="Consumer Protection Division"
        headerSubtitle="Schedule appointments and manage your visits"
      >
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load data</h3>
                <p className="text-gray-500 mb-6">
                  We're having trouble connecting to our services. Please try again later.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
                <p className="text-gray-600">
                  Schedule appointments and manage your visits to our locations
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-sm text-blue-700 font-medium">
                Customer Services Portal
              </div>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { label: 'Customer Portal', isActive: true }
              ]}
              className="mb-4"
            />
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200 border-2">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Currently Waiting</p>
                    <p className="text-2xl font-bold text-blue-700">{queueStats.waiting}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 border-2">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Being Served</p>
                    <p className="text-2xl font-bold text-green-700">{queueStats.inProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 border-2">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Today's Total</p>
                    <p className="text-2xl font-bold text-purple-700">{queueStats.totalToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200 border-2">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Open Locations</p>
                    <p className="text-2xl font-bold text-amber-700">{queueStats.activeLocations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
