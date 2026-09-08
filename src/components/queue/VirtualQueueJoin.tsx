
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
        title: t('public.virtualQueue.join.missingInfo'),
        description: t('public.virtualQueue.join.fillRequired'),
        variant: 'destructive'
      });
      return;
    }

    setIsJoining(true);
    try {
      const [firstName, ...lastNameParts] = customerName.trim().split(/\s+/);
      const lastName = lastNameParts.join(' ');
      if (!lastName) {
        throw new Error(t('public.virtualQueue.join.fullNameRequired'));
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
        title: t('public.virtualQueue.join.joinedTitle'),
        description: t('public.virtualQueue.join.joinedDescription', { position: ticketData.position, service: appointment.service_name }),
      });

    } catch (error) {
      console.error('Error joining queue:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('public.virtualQueue.join.joinFailed'),
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
          {t('public.virtualQueue.join.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">{t('public.virtualQueue.join.selectLocation')}</Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder={t('public.virtualQueue.join.chooseLocation')} />
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
            <Label htmlFor="service">{t('public.virtualQueue.join.selectService')}</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder={t('public.virtualQueue.join.chooseService')} />
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
                  <span>{t('public.virtualQueue.join.waiting', { count: queueStats.waiting })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{t('public.virtualQueue.join.waitApprox', { minutes: queueStats.estimatedWait })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">{t('public.virtualQueue.join.fullName')}</Label>
          <Input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={t('public.virtualQueue.join.fullNamePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('public.virtualQueue.join.phone')}</Label>
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
          {isJoining ? t('public.virtualQueue.join.joining') : t('public.virtualQueue.join.joinButton')}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <QrCode className="h-3 w-3" />
            <span>{t('public.virtualQueue.join.qrNote')}</span>
          </div>
          <div>{t('public.virtualQueue.join.smsNote')}</div>
          <div>{t('public.virtualQueue.join.arriveNote')}</div>
        </div>
      </CardContent>
    </Card>
  );
};
