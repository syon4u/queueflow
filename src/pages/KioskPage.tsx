
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KioskHeader } from '@/components/kiosk/KioskHeader';
import { KioskServiceSelector } from '@/components/kiosk/KioskServiceSelector';
import { KioskLocationSelector } from '@/components/kiosk/KioskLocationSelector';
import { KioskTicketGeneration } from '@/components/kiosk/KioskTicketGeneration';
import { KioskCustomerForm } from '@/components/kiosk/KioskCustomerForm';
import { useToast } from '@/hooks/use-toast';
import { createPublicAppointment } from '@/lib/publicQueue';
import { useAppData } from '@/hooks/useAppData';

export type KioskStep = 'location' | 'service' | 'customer' | 'ticket';

interface KioskState {
  step: KioskStep;
  selectedLocation: string | null;
  selectedService: string | null;
  customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  } | null;
  appointmentId: string | null;
}

const KioskPage = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { locations, services, isLoading } = useAppData();
  const [kioskState, setKioskState] = useState<KioskState>({
    step: 'location',
    selectedLocation: null,
    selectedService: null,
    customerData: null,
    appointmentId: null,
  });

  // Auto-reset kiosk after ticket generation
  useEffect(() => {
    if (kioskState.step === 'ticket' && kioskState.appointmentId) {
      const timer = setTimeout(() => {
        setKioskState({
          step: 'location',
          selectedLocation: null,
          selectedService: null,
          customerData: null,
          appointmentId: null,
        });
      }, 30000); // Reset after 30 seconds

      return () => clearTimeout(timer);
    }
  }, [kioskState.step, kioskState.appointmentId]);

  // Filter services by selected location
  const availableServices = services.filter(
    service => service.location_id === kioskState.selectedLocation
  );

  // Filter open locations
  const openLocations = locations.filter(
    location => location.queue_status === 'open'
  );

  const handleLocationSelect = (locationId: string) => {
    setKioskState(prev => ({
      ...prev,
      selectedLocation: locationId,
      step: 'service',
    }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setKioskState(prev => ({
      ...prev,
      selectedService: serviceId,
      step: 'customer',
    }));
  };

  const handleCustomerSubmit = async (customerData: KioskState['customerData']) => {
    if (!customerData || !kioskState.selectedLocation || !kioskState.selectedService) {
      toast({
        title: t('common.error'),
        description: t('public.kiosk.toast.missingInfo'),
        variant: 'destructive',
      });
      return;
    }

    try {
      // Walk-in: create (or reuse) the customer and join the queue right away.
      const appointment = await createPublicAppointment({
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone,
        email: customerData.email,
        serviceId: kioskState.selectedService,
        locationId: kioskState.selectedLocation,
        reason: 'Walk-in service',
        checkIn: true,
      });

      setKioskState(prev => ({
        ...prev,
        customerData,
        appointmentId: appointment.appointment_id,
        step: 'ticket',
      }));

      toast({
        title: t('public.kiosk.toast.success'),
        description: t('public.kiosk.toast.ticketGenerated'),
      });

    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('public.kiosk.toast.createFailed'),
        variant: 'destructive',
      });
    }
  };

  const handleStartOver = () => {
    setKioskState({
      step: 'location',
      selectedLocation: null,
      selectedService: null,
      customerData: null,
      appointmentId: null,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <KioskHeader 
          currentStep={kioskState.step}
          onStartOver={handleStartOver}
        />
        
        <div className="mt-10">
          {kioskState.step === 'location' && (
            <div className="animate-fade-in">
              <KioskLocationSelector
                locations={openLocations}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          )}
          
          {kioskState.step === 'service' && (
            <div className="animate-fade-in">
              <KioskServiceSelector
                services={availableServices}
                onServiceSelect={handleServiceSelect}
                onBack={() => setKioskState(prev => ({ ...prev, step: 'location' }))}
              />
            </div>
          )}
          
          {kioskState.step === 'customer' && (
            <div className="animate-fade-in">
              <KioskCustomerForm
                onSubmit={handleCustomerSubmit}
                onBack={() => setKioskState(prev => ({ ...prev, step: 'service' }))}
              />
            </div>
          )}
          
          {kioskState.step === 'ticket' && kioskState.appointmentId && (
            <div className="animate-fade-in">
              <KioskTicketGeneration
                appointmentId={kioskState.appointmentId}
                customerData={kioskState.customerData!}
                locationId={kioskState.selectedLocation!}
                serviceId={kioskState.selectedService!}
                onStartOver={handleStartOver}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KioskPage;
