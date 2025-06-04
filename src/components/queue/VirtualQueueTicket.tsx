
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, MapPin, Clock, Users, Phone, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';

interface TicketData {
  id: string;
  ticketId: string;
  qrCode: string;
  position: number;
  estimatedWait: number;
  customers: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  services: {
    name: string;
  };
  locations: {
    name: string;
  };
  status: string;
}

interface VirtualQueueTicketProps {
  ticketData: TicketData;
  onCheckIn: () => void;
}

export const VirtualQueueTicket: React.FC<VirtualQueueTicketProps> = ({ 
  ticketData, 
  onCheckIn 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(ticketData.qrCode);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    generateQR();
  }, [ticketData.qrCode]);

  const isCheckedIn = ticketData.status === 'checked_in';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Your Queue Ticket
        </CardTitle>
        <div className="text-2xl font-bold text-blue-600">
          #{ticketData.ticketId}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          {qrCodeUrl && (
            <img 
              src={qrCodeUrl} 
              alt="Queue ticket QR code"
              className="w-32 h-32 border-2 border-gray-200 rounded-lg"
            />
          )}
        </div>

        {/* Status Badge */}
        <div className="text-center">
          <Badge 
            variant={isCheckedIn ? 'default' : 'outline'}
            className={isCheckedIn ? 'bg-green-600 text-white' : 'bg-orange-100 text-orange-700'}
          >
            {isCheckedIn ? 'Checked In' : 'Virtual Queue'}
          </Badge>
        </div>

        {/* Position & Wait Time */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Position</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                #{ticketData.position}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-4 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Est. Wait</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {ticketData.estimatedWait}m
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="font-medium">{ticketData.locations.name}</span>
          </div>
          <div className="text-gray-600">
            Service: {ticketData.services.name}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{ticketData.customers.phone}</span>
          </div>
        </div>

        {/* Check-in Button */}
        {!isCheckedIn && (
          <Button 
            onClick={onCheckIn}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            I'm Here - Check In
          </Button>
        )}

        {isCheckedIn && (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">You're checked in!</p>
            <p className="text-green-600 text-sm">Please wait to be called for service</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Keep this ticket handy for check-in</div>
          <div>• You'll receive SMS updates on your position</div>
          <div>• Scan QR code at kiosk or show to staff</div>
        </div>
      </CardContent>
    </Card>
  );
};
