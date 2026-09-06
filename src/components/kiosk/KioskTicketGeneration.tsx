
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Printer, QrCode, Home, MapPin, Clock, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { findPublicAppointment } from '@/lib/publicQueue';
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

  // Appointment details + live queue position (one public RPC, refreshed while the ticket is shown)
  const { data: appointment } = useQuery({
    queryKey: ['kiosk-appointment', appointmentId],
    queryFn: () => findPublicAppointment({ appointmentId }),
    refetchInterval: 15000,
  });

  const appointmentDetails = appointment
    ? {
        locations: { name: appointment.location_name, address: appointment.location_address },
        services: { name: appointment.service_name, duration: appointment.service_duration },
      }
    : undefined;
  const queuePosition = appointment?.position ?? 1;

  const handlePrint = () => {
    window.print();
  };

  const ticketId = appointment?.ticket_number ?? appointmentId.slice(-8).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-green-800 mb-2">
              Ticket Generated Successfully!
            </h3>
            <p className="text-xl text-green-700">
              You're now in the queue. Please wait for your number to be called.
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Display */}
      <Card className="print:shadow-none shadow-2xl border-2 border-gray-200 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              QueueFlow Service Ticket
            </h2>
            <div className="text-7xl font-mono font-bold mb-4">
              #{ticketId}
            </div>
            <p className="text-xl opacity-90">
              Keep this ticket until you are served
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Customer Info Tile */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Customer</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {customerData.firstName} {customerData.lastName}
                </p>
                <p className="text-lg text-gray-700">{customerData.phone}</p>
              </div>

              {/* Location Info Tile */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Location</h4>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {appointmentDetails?.locations?.name}
                </p>
              </div>

              {/* Service Info Tile */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Service</h4>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  {appointmentDetails?.services?.name}
                </p>
                <p className="text-lg text-gray-700">
                  Est. {appointmentDetails?.services?.duration} minutes
                </p>
              </div>

              {/* Queue Position Tile */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Queue Position</h4>
                <div className="text-center">
                  <div className="text-6xl font-bold text-orange-600 mb-2">
                    #{queuePosition || 1}
                  </div>
                  <p className="text-lg text-gray-700">in line</p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            {qrCodeUrl && (
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 inline-block">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">QR Code</h4>
                  <img 
                    src={qrCodeUrl} 
                    alt="Ticket QR Code" 
                    className="mx-auto border-2 border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-600 mt-3">
                    Scan to check status
                  </p>
                </div>
              </div>
            )}

            <div className="text-center text-lg text-gray-600 mb-6 bg-gray-50 rounded-xl p-4">
              <p>Check-in time: {new Date().toLocaleString()}</p>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 text-center">
              <p className="text-lg text-gray-700 mb-2 font-medium">
                Please stay in the waiting area. You will be called when it's your turn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-8 print:hidden">
        <Button 
          variant="outline" 
          onClick={handlePrint} 
          className="flex items-center gap-3 px-8 py-4 text-xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-2xl shadow-lg"
        >
          <Printer className="h-6 w-6" />
          Print Ticket
        </Button>
        
        <Button 
          onClick={onStartOver} 
          className="flex items-center gap-3 px-8 py-4 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg"
        >
          <Home className="h-6 w-6" />
          New Ticket ({countdown}s)
        </Button>
      </div>
    </div>
  );
};
