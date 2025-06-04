
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

  // Get current queue length for selected service
  const { data: queueStats } = useQuery({
    queryKey: ['queue-stats', selectedLocation, selectedService],
    queryFn: async () => {
      if (!selectedLocation || !selectedService) return null;
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('appointments')
        .select('status')
        .eq('location_id', selectedLocation)
        .eq('service_id', selectedService)
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`);
      
      if (error) throw error;
      
      const waiting = data.filter(a => a.status === 'checked_in').length;
      const estimatedWait = waiting * 15; // 15 minutes per person estimate
      
      return { waiting, estimatedWait };
    },
    enabled: !!(selectedLocation && selectedService),
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
      // First create or find customer
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customerPhone)
        .single();

      let customerId = existingCustomer?.id;

      if (!customerId) {
        const [firstName, ...lastNameParts] = customerName.split(' ');
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            first_name: firstName,
            last_name: lastNameParts.join(' ') || '',
            phone: customerPhone
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Create appointment for virtual queue
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: selectedService,
          location_id: selectedLocation,
          scheduled_time: new Date().toISOString(),
          status: 'scheduled',
          notes: 'Virtual queue - remote join'
        })
        .select(`
          *,
          customers!appointments_customer_id_fkey(first_name, last_name, phone),
          services!appointments_service_id_fkey(name),
          locations!appointments_location_id_fkey(name)
        `)
        .single();

      if (appointmentError) throw appointmentError;

      // Generate QR code data
      const qrData = JSON.stringify({
        appointmentId: appointment.id,
        customerId: customerId,
        timestamp: Date.now()
      });

      const ticketData = {
        ...appointment,
        qrCode: qrData,
        ticketId: appointment.id.split('-')[0].toUpperCase(),
        position: (queueStats?.waiting || 0) + 1,
        estimatedWait: queueStats?.estimatedWait || 15
      };

      onJoinSuccess(ticketData);
      
      toast({
        title: 'Successfully Joined Queue',
        description: `You're #${ticketData.position} in line for ${appointment.services.name}`,
      });

    } catch (error) {
      console.error('Error joining queue:', error);
      toast({
        title: 'Error',
        description: 'Failed to join queue. Please try again.',
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
