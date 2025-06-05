
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KioskHeader } from '@/components/kiosk/KioskHeader';
import { KioskServiceSelector } from '@/components/kiosk/KioskServiceSelector';
import { KioskLocationSelector } from '@/components/kiosk/KioskLocationSelector';
import { KioskTicketGeneration } from '@/components/kiosk/KioskTicketGeneration';
import { KioskCustomerForm } from '@/components/kiosk/KioskCustomerForm';
import { useToast } from '@/hooks/use-toast';

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

  // Fetch locations for selection
  const { data: locations } = useQuery({
    queryKey: ['kiosk-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, address')
        .eq('queue_status', 'open')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch services for selected location
  const { data: services } = useQuery({
    queryKey: ['kiosk-services', kioskState.selectedLocation],
    queryFn: async () => {
      if (!kioskState.selectedLocation) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name, description, duration')
        .eq('location_id', kioskState.selectedLocation)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!kioskState.selectedLocation,
  });

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
        title: 'Error',
        description: 'Missing required information',
        variant: 'destructive',
      });
      return;
    }

    try {
      // First, create or find customer
      let customerId: string;
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customerData.phone)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert([{
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            phone: customerData.phone,
            email: customerData.email || null,
          }])
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Create appointment as walk-in (immediate scheduling)
      const now = new Date().toISOString();
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          customer_id: customerId,
          service_id: kioskState.selectedService,
          location_id: kioskState.selectedLocation,
          scheduled_time: now,
          check_in_time: now,
          status: 'checked_in',
          reason_for_visit: 'Walk-in service',
        }])
        .select('id')
        .single();

      if (appointmentError) throw appointmentError;

      setKioskState(prev => ({
        ...prev,
        customerData,
        appointmentId: appointment.id,
        step: 'ticket',
      }));

      toast({
        title: 'Success',
        description: 'Your ticket has been generated!',
      });

    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create appointment. Please try again.',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <KioskHeader 
          currentStep={kioskState.step}
          onStartOver={handleStartOver}
        />
        
        <div className="mt-8">
          {kioskState.step === 'location' && (
            <KioskLocationSelector
              locations={locations || []}
              onLocationSelect={handleLocationSelect}
            />
          )}
          
          {kioskState.step === 'service' && (
            <KioskServiceSelector
              services={services || []}
              onServiceSelect={handleServiceSelect}
              onBack={() => setKioskState(prev => ({ ...prev, step: 'location' }))}
            />
          )}
          
          {kioskState.step === 'customer' && (
            <KioskCustomerForm
              onSubmit={handleCustomerSubmit}
              onBack={() => setKioskState(prev => ({ ...prev, step: 'service' }))}
            />
          )}
          
          {kioskState.step === 'ticket' && kioskState.appointmentId && (
            <KioskTicketGeneration
              appointmentId={kioskState.appointmentId}
              customerData={kioskState.customerData!}
              locationId={kioskState.selectedLocation!}
              serviceId={kioskState.selectedService!}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default KioskPage;
