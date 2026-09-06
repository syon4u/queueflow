
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Users, Smartphone, QrCode } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createPublicAppointment, getQueueSnapshot } from '@/lib/publicQueue';

interface VirtualQueueJoinProps {
  onJoinSuccess: (ticketData: any) => void;
}

export const VirtualQueueJoin: React.FC<VirtualQueueJoinProps> = ({ onJoinSuccess }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('queue_status', 'open')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch services for selected location
  const { data: services = [] } = useQuery({
    queryKey: ['services', selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('location_id', selectedLocation)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedLocation
  });

  // Live queue depth at the selected location
  const { data: queueStats } = useQuery({
    queryKey: ['queue-snapshot', selectedLocation],
    queryFn: async () => {
      const snapshot = await getQueueSnapshot(selectedLocation);
      return { waiting: snapshot.waiting, estimatedWait: snapshot.estimated_wait_minutes };
    },
    enabled: !!selectedLocation,
    refetchInterval: 30000
  });

  const handleJoinQueue = async () => {
    if (!selectedLocation || !selectedService || !customerName || !customerPhone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsJoining(true);
    try {
      const [firstName, ...lastNameParts] = customerName.trim().split(/\s+/);
      const lastName = lastNameParts.join(' ');
      if (!lastName) {
        throw new Error('Please enter your first and last name.');
      }

      // Remote join: a scheduled appointment the customer checks in on arrival.
      const appointment = await createPublicAppointment({
        firstName,
        lastName,
        phone: customerPhone,
        serviceId: selectedService,
        locationId: selectedLocation,
        notes: 'Virtual queue - remote join',
      });

      // QR payload carries the appointment id + code so /check-in can verify it.
      const qrData = JSON.stringify({
        appointmentId: appointment.appointment_id,
        confirmationCode: appointment.confirmation_code,
        timestamp: Date.now()
      });

      const ticketData = {
        id: appointment.appointment_id,
        status: appointment.status,
        confirmationCode: appointment.confirmation_code,
        customers: {
          first_name: appointment.first_name,
          last_name: appointment.last_name,
          phone: appointment.phone,
        },
        services: { name: appointment.service_name },
        locations: { name: appointment.location_name },
        qrCode: qrData,
        ticketId: appointment.confirmation_code,
        position: (queueStats?.waiting || 0) + 1,
        estimatedWait: queueStats?.estimatedWait || 15
      };

      onJoinSuccess(ticketData);

      toast({
        title: 'Successfully Joined Queue',
        description: `You're expected to be #${ticketData.position} in line for ${appointment.service_name}. Check in when you arrive.`,
      });

    } catch (error) {
      console.error('Error joining queue:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to join queue. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Join Virtual Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Select Location</Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {location.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedLocation && (
          <div className="space-y-2">
            <Label htmlFor="service">Select Service</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {queueStats && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>{queueStats.waiting} waiting</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>~{queueStats.estimatedWait} min wait</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <Button 
          onClick={handleJoinQueue}
          disabled={isJoining || !selectedLocation || !selectedService || !customerName || !customerPhone}
          className="w-full"
        >
          {isJoining ? 'Joining Queue...' : 'Join Virtual Queue'}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <QrCode className="h-3 w-3" />
            <span>You'll receive a QR code for easy check-in</span>
          </div>
          <div>• SMS updates on your queue position</div>
          <div>• Check in when you arrive at the location</div>
        </div>
      </CardContent>
    </Card>
  );
};
