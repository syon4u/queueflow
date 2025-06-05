import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Printer, Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import { KIOSK_STEPS, type KioskStep } from './types';

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
  const queryClient = useQueryClient();

  // Fetch locations
  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ['kiosk-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, current_capacity, max_capacity')
        .eq('is_active', true);
      
      if (error) throw error;
      return (data || []) as Location[];
    }
  });

  // Fetch services for selected location
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['kiosk-services', selectedLocation?.id],
    queryFn: async () => {
      if (!selectedLocation) return [] as Service[];
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name, description, duration')
        .eq('location_id', selectedLocation.id)
        .eq('is_active', true);
      
      if (error) throw error;
      return (data || []) as Service[];
    },
    enabled: !!selectedLocation
  });

  // Create walk-in appointment
  const createAppointmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedLocation || !selectedService) {
        throw new Error('Location and service must be selected');
      }

      const response = await supabase.functions.invoke('appointments', {
        body: {
          type: 'walk_in',
          location_id: selectedLocation.id,
          service_id: selectedService.id,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_email: customerInfo.email
        }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: async (data) => {
      const ticket: KioskTicket = {
        ticket_number: data.ticket_number,
        appointment_id: data.appointment_id,
        service_name: selectedService!.name,
        location_name: selectedLocation!.name,
        estimated_wait_time: data.estimated_wait_time || 0,
        qr_code_data: `${window.location.origin}/mobile-queue?appointment=${data.appointment_id}`
      };

      // Generate QR code
      const qrUrl = await QRCode.toDataURL(ticket.qr_code_data);
      setQrCodeUrl(qrUrl);
      setGeneratedTicket(ticket);
      setCurrentStep(KIOSK_STEPS.TICKET);

      toast({
        title: 'Ticket Generated Successfully!',
        description: `Your ticket number is ${ticket.ticket_number}`,
      });

      queryClient.invalidateQueries({ queryKey: ['queue-position'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Creating Appointment',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
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
    }
  };

  const getCapacityColor = (current: number, max: number) => {
    const utilization = current / max;
    if (utilization < 0.7) return 'bg-green-100 text-green-800';
    if (utilization < 0.9) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Location Selection Step
  if (currentStep === KIOSK_STEPS.LOCATION) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Select Your Location</CardTitle>
          </CardHeader>
          <CardContent>
            {locationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading locations...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {locations?.map((location) => (
                  <Button
                    key={location.id}
                    variant="outline"
                    className="h-auto p-6 text-left justify-between"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{location.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          {location.current_capacity}/{location.max_capacity} capacity
                        </span>
                        <Badge className={getCapacityColor(location.current_capacity, location.max_capacity)}>
                          {Math.round((location.current_capacity / location.max_capacity) * 100)}% full
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Service Selection Step
  if (currentStep === KIOSK_STEPS.SERVICE) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Select Service</CardTitle>
            <p className="text-center text-muted-foreground">
              Location: <strong>{selectedLocation?.name}</strong>
            </p>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading services...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services?.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className="h-auto p-6 text-left justify-between w-full"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">~{service.duration} minutes</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                ))}
                <Button variant="ghost" onClick={goBack} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Locations
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Customer Information Step
  if (currentStep === KIOSK_STEPS.CUSTOMER_INFO) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Your Information</CardTitle>
            <p className="text-center text-muted-foreground">
              Service: <strong>{selectedService?.name}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="text-lg h-12"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="text-lg h-12"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className="text-lg h-12"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={goBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleCustomerInfoSubmit} className="flex-1">
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Confirmation Step
  if (currentStep === KIOSK_STEPS.CONFIRMATION) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Confirm Your Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div><strong>Location:</strong> {selectedLocation?.name}</div>
              <div><strong>Service:</strong> {selectedService?.name}</div>
              <div><strong>Name:</strong> {customerInfo.name}</div>
              {customerInfo.phone && <div><strong>Phone:</strong> {customerInfo.phone}</div>}
              {customerInfo.email && <div><strong>Email:</strong> {customerInfo.email}</div>}
              <div><strong>Estimated Duration:</strong> {selectedService?.duration} minutes</div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={goBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleConfirmAppointment} 
                disabled={createAppointmentMutation.isPending}
                className="flex-1"
              >
                {createAppointmentMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    Confirm & Get Ticket
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ticket Display Step
  if (currentStep === KIOSK_STEPS.TICKET && generatedTicket) {
    return (
      <div className="space-y-6">
        <Card className="print:shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-600">Ticket Generated!</CardTitle>
            <p className="text-lg">Please keep this ticket for your records</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                #{generatedTicket.ticket_number}
              </div>
              <div className="text-xl font-semibold">{generatedTicket.service_name}</div>
              <div className="text-lg text-muted-foreground">{generatedTicket.location_name}</div>
              {generatedTicket.estimated_wait_time > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-lg">Estimated wait: {generatedTicket.estimated_wait_time} minutes</span>
                </div>
              )}
            </div>

            {qrCodeUrl && (
              <div className="text-center">
                <p className="mb-4 font-semibold">Scan for mobile queue tracking:</p>
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />
                <p className="text-sm text-muted-foreground mt-2">
                  Or visit: {generatedTicket.qr_code_data}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={handlePrintTicket} className="flex-1" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Ticket
              </Button>
              <Button onClick={handleStartOver} className="flex-1">
                New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
