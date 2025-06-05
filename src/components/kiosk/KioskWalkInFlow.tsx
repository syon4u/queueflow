
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { KIOSK_STEPS, type KioskStep } from './types';
import { useKioskLocations } from '@/hooks/kiosk/useKioskLocations';
import { useKioskServices } from '@/hooks/kiosk/useKioskServices';
import { useKioskAppointment } from '@/hooks/kiosk/useKioskAppointment';
import { LocationSelectionStep } from './steps/LocationSelectionStep';
import { ServiceSelectionStep } from './steps/ServiceSelectionStep';
import { CustomerInfoStep } from './steps/CustomerInfoStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { TicketDisplayStep } from './steps/TicketDisplayStep';

interface Location {
  id: string;
  name: string;
  current_capacity: number;
  max_capacity: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
}

interface KioskTicket {
  ticket_number: string;
  appointment_id: string;
  service_name: string;
  location_name: string;
  estimated_wait_time: number;
  qr_code_data: string;
}

export const KioskWalkInFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<KioskStep>(KIOSK_STEPS.LOCATION);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [generatedTicket, setGeneratedTicket] = useState<KioskTicket | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  const { toast } = useToast();

  const locationsQuery = useKioskLocations();
  const servicesQuery = useKioskServices(selectedLocation);
  
  const createAppointmentMutation = useKioskAppointment({
    selectedLocation,
    selectedService,
    customerInfo,
    onSuccess: (ticket, qrUrl) => {
      setQrCodeUrl(qrUrl);
      setGeneratedTicket(ticket);
      setCurrentStep(KIOSK_STEPS.TICKET);
    }
  });

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setCurrentStep(KIOSK_STEPS.SERVICE);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep(KIOSK_STEPS.CUSTOMER_INFO);
  };

  const handleCustomerInfoSubmit = () => {
    if (!customerInfo.name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name to continue',
        variant: 'destructive',
      });
      return;
    }
    setCurrentStep(KIOSK_STEPS.CONFIRMATION);
  };

  const handleConfirmAppointment = () => {
    createAppointmentMutation.mutate();
  };

  const handlePrintTicket = () => {
    window.print();
    toast({
      title: 'Printing Ticket',
      description: 'Your ticket is being printed',
    });
  };

  const handleStartOver = () => {
    setCurrentStep(KIOSK_STEPS.LOCATION);
    setSelectedLocation(null);
    setSelectedService(null);
    setCustomerInfo({ name: '', phone: '', email: '' });
    setGeneratedTicket(null);
    setQrCodeUrl('');
  };

  const goBack = () => {
    switch (currentStep) {
      case KIOSK_STEPS.SERVICE:
        setCurrentStep(KIOSK_STEPS.LOCATION);
        setSelectedLocation(null);
        break;
      case KIOSK_STEPS.CUSTOMER_INFO:
        setCurrentStep(KIOSK_STEPS.SERVICE);
        setSelectedService(null);
        break;
      case KIOSK_STEPS.CONFIRMATION:
        setCurrentStep(KIOSK_STEPS.CUSTOMER_INFO);
        break;
      default:
        return;
    }
  };

  const locations = locationsQuery.data || [];
  const services = servicesQuery.data || [];

  // Location Selection Step
  if (currentStep === KIOSK_STEPS.LOCATION) {
    return (
      <div className="space-y-6">
        <LocationSelectionStep
          locations={locations}
          isLoading={locationsQuery.isLoading}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    );
  }

  // Service Selection Step
  if (currentStep === KIOSK_STEPS.SERVICE && selectedLocation) {
    return (
      <div className="space-y-6">
        <ServiceSelectionStep
          selectedLocation={selectedLocation}
          services={services}
          isLoading={servicesQuery.isLoading}
          onServiceSelect={handleServiceSelect}
          onBack={goBack}
        />
      </div>
    );
  }

  // Customer Information Step
  if (currentStep === KIOSK_STEPS.CUSTOMER_INFO && selectedService) {
    return (
      <div className="space-y-6">
        <CustomerInfoStep
          selectedService={selectedService}
          customerInfo={customerInfo}
          onCustomerInfoChange={setCustomerInfo}
          onSubmit={handleCustomerInfoSubmit}
          onBack={goBack}
        />
      </div>
    );
  }

  // Confirmation Step
  if (currentStep === KIOSK_STEPS.CONFIRMATION && selectedLocation && selectedService) {
    return (
      <div className="space-y-6">
        <ConfirmationStep
          selectedLocation={selectedLocation}
          selectedService={selectedService}
          customerInfo={customerInfo}
          isLoading={createAppointmentMutation.isPending}
          onConfirm={handleConfirmAppointment}
          onBack={goBack}
        />
      </div>
    );
  }

  // Ticket Display Step
  if (currentStep === KIOSK_STEPS.TICKET && generatedTicket) {
    return (
      <div className="space-y-6">
        <TicketDisplayStep
          ticket={generatedTicket}
          qrCodeUrl={qrCodeUrl}
          onPrint={handlePrintTicket}
          onStartOver={handleStartOver}
        />
      </div>
    );
  }

  return null;
};
