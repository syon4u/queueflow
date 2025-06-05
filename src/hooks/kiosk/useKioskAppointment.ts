
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

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

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface KioskTicket {
  ticket_number: string;
  appointment_id: string;
  service_name: string;
  location_name: string;
  estimated_wait_time: number;
  qr_code_data: string;
}

interface UseKioskAppointmentProps {
  selectedLocation: Location | null;
  selectedService: Service | null;
  customerInfo: CustomerInfo;
  onSuccess: (ticket: KioskTicket, qrCodeUrl: string) => void;
}

export const useKioskAppointment = ({
  selectedLocation,
  selectedService,
  customerInfo,
  onSuccess
}: UseKioskAppointmentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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

      const qrUrl = await QRCode.toDataURL(ticket.qr_code_data);
      onSuccess(ticket, qrUrl);

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
};
