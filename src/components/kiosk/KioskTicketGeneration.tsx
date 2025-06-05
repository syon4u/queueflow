
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Printer, QrCode, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

interface KioskTicketGenerationProps {
  appointmentId: string;
  customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  locationId: string;
  serviceId: string;
  onStartOver: () => void;
}

export const KioskTicketGeneration: React.FC<KioskTicketGenerationProps> = ({
  appointmentId,
  customerData,
  locationId,
  serviceId,
  onStartOver,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [countdown, setCountdown] = useState(30);

  // Generate QR code
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = JSON.stringify({
          appointmentId,
          customerId: customerData.phone,
          type: 'checkin'
        });
        const url = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [appointmentId, customerData.phone]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch appointment details
  const { data: appointmentDetails } = useQuery({
    queryKey: ['kiosk-appointment', appointmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          locations(name, address),
          services(name, duration)
        `)
        .eq('id', appointmentId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Get queue position
  const { data: queuePosition } = useQuery({
    queryKey: ['queue-position', appointmentId],
    queryFn: async () => {
      // Get all checked-in appointments for this location
      const { data, error } = await supabase
        .from('appointments')
        .select('id, check_in_time')
        .eq('location_id', locationId)
        .eq('status', 'checked_in')
        .order('check_in_time', { ascending: true });
      
      if (error) throw error;
      
      const position = data.findIndex(apt => apt.id === appointmentId) + 1;
      return position > 0 ? position : 1;
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const ticketId = appointmentId.slice(-8).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="text-xl font-bold text-green-800">
              Ticket Generated Successfully!
            </h3>
            <p className="text-green-700">
              You're now in the queue. Please wait for your number to be called.
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Display */}
      <Card className="print:shadow-none">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              QueueFlow Service Ticket
            </h2>
            <div className="text-6xl font-mono font-bold text-blue-600 mb-2">
              #{ticketId}
            </div>
            <p className="text-gray-600">
              Keep this ticket until you are served
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Customer</h4>
                <p className="text-gray-900">
                  {customerData.firstName} {customerData.lastName}
                </p>
                <p className="text-gray-600">{customerData.phone}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Location</h4>
                <p className="text-gray-900">
                  {appointmentDetails?.locations?.name}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Service</h4>
                <p className="text-gray-900">
                  {appointmentDetails?.services?.name}
                </p>
                <p className="text-gray-600">
                  Est. {appointmentDetails?.services?.duration} minutes
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Queue Position</h4>
                <div className="text-4xl font-bold text-blue-600">
                  #{queuePosition || 1}
                </div>
                <p className="text-gray-600 text-sm">in line</p>
              </div>

              {qrCodeUrl && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">QR Code</h4>
                  <img 
                    src={qrCodeUrl} 
                    alt="Ticket QR Code" 
                    className="mx-auto border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Scan to check status
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 mb-6">
            <p>Check-in time: {new Date().toLocaleString()}</p>
          </div>

          <div className="border-t pt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Please stay in the waiting area. You will be called when it's your turn.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Ticket
        </Button>
        
        <Button onClick={onStartOver} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          New Ticket ({countdown}s)
        </Button>
      </div>
    </div>
  );
};
