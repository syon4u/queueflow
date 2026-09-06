
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppointmentLookup } from '@/hooks/customer/useAppointmentLookup';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import QRCode from 'qrcode';

const AppointmentLookupPage: React.FC = () => {
  const [lookupMethod, setLookupMethod] = useState<'confirmation' | 'details'>('confirmation');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const { toast } = useToast();

  const {
    appointment,
    isLoading,
    error,
    lookupAppointment,
    cancelAppointment,
    isCancelling
  } = useAppointmentLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lookupMethod === 'confirmation' && confirmationNumber.trim()) {
      await lookupAppointment({ confirmationNumber: confirmationNumber.trim() });
    } else if (lookupMethod === 'details' && lastName.trim() && phone.trim()) {
      await lookupAppointment({ lastName: lastName.trim(), phone: phone.trim() });
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;
    
    const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (confirmed) {
      const success = await cancelAppointment(appointment.id);
      if (success) {
        toast({
          title: 'Appointment Cancelled',
          description: 'Your appointment has been successfully cancelled.',
        });
      }
    }
  };

  const generateQRCode = async (appointmentNumber: string) => {
    try {
      const url = await QRCode.toDataURL(appointmentNumber);
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  React.useEffect(() => {
    if (appointment?.confirmation_number) {
      generateQRCode(appointment.confirmation_number);
    }
  }, [appointment]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancel = appointment && ['scheduled', 'checked_in'].includes(appointment.status);

  return (
    <PageLayout 
      headerTitle="QueueFlow"
      headerSubtitle="View and manage your appointments"
    >
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/customer" className="mr-3">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Find My Appointment</h1>
          </div>

          {/* Lookup Form */}
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Search for Your Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Method Selection */}
              <div className="flex space-x-2 mb-4">
                <Button 
                  type="button" 
                  variant={lookupMethod === 'confirmation' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLookupMethod('confirmation')} 
                  className="flex-1"
                >
                  Confirmation Number
                </Button>
                <Button 
                  type="button" 
                  variant={lookupMethod === 'details' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLookupMethod('details')} 
                  className="flex-1"
                >
                  Name & Phone
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {lookupMethod === 'confirmation' ? (
                  <div>
                    <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmation Number
                    </label>
                    <Input 
                      id="confirmation" 
                      type="text" 
                      placeholder="Enter your confirmation number" 
                      value={confirmationNumber} 
                      onChange={(e) => setConfirmationNumber(e.target.value)} 
                      autoFocus 
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input 
                        id="lastName" 
                        type="text" 
                        placeholder="Enter your last name" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        autoFocus 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || (lookupMethod === 'confirmation' ? !confirmationNumber.trim() : !lastName.trim() || !phone.trim())}
                >
                  {isLoading ? 'Searching...' : 'Find Appointment'}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment Details */}
          {appointment && (
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Status and Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {appointment.customer?.first_name} {appointment.customer?.last_name}
                      </h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    {qrCodeUrl && (
                      <div className="text-center">
                        <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16 mx-auto" />
                        <p className="text-xs text-gray-500 mt-1">QR Code</p>
                      </div>
                    )}
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Date & Time</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.scheduled_time).toLocaleDateString()} at{' '}
                          {new Date(appointment.scheduled_time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{appointment.location?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Service</p>
                        <p className="text-sm text-gray-600">{appointment.service?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <QrCode className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Confirmation</p>
                        <p className="text-sm text-gray-600 font-mono">{appointment.confirmation_number}</p>
                      </div>
                    </div>

                    {appointment.customer?.phone && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <p className="text-sm text-gray-600">{appointment.customer.phone}</p>
                        </div>
                      </div>
                    )}

                    {appointment.customer?.email && (
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">{appointment.customer.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {appointment.reason_for_visit && (
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Reason for Visit</p>
                      <p className="text-sm text-gray-600">{appointment.reason_for_visit}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    {canCancel && (
                      <Button 
                        variant="destructive" 
                        onClick={handleCancel}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
                      </Button>
                    )}
                    
                    <Link to="/status" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Check Queue Status
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AppointmentLookupPage;
