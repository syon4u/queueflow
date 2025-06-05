
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Clock } from 'lucide-react';

interface KioskTicket {
  ticket_number: string;
  appointment_id: string;
  service_name: string;
  location_name: string;
  estimated_wait_time: number;
  qr_code_data: string;
}

interface TicketDisplayStepProps {
  ticket: KioskTicket;
  qrCodeUrl: string;
  onPrint: () => void;
  onStartOver: () => void;
}

export const TicketDisplayStep: React.FC<TicketDisplayStepProps> = ({
  ticket,
  qrCodeUrl,
  onPrint,
  onStartOver
}) => {
  return (
    <Card className="print:shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-green-600">Ticket Generated!</CardTitle>
        <p className="text-lg">Please keep this ticket for your records</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            #{ticket.ticket_number}
          </div>
          <div className="text-xl font-semibold">{ticket.service_name}</div>
          <div className="text-lg text-muted-foreground">{ticket.location_name}</div>
          {ticket.estimated_wait_time > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-lg">Estimated wait: {ticket.estimated_wait_time} minutes</span>
            </div>
          )}
        </div>

        {qrCodeUrl && (
          <div className="text-center">
            <p className="mb-4 font-semibold">Scan for mobile queue tracking:</p>
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />
            <p className="text-sm text-muted-foreground mt-2">
              Or visit: {ticket.qr_code_data}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={onPrint} className="flex-1" variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Ticket
          </Button>
          <Button onClick={onStartOver} className="flex-1">
            New Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
