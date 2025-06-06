
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, CheckCircle, Loader2, User, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AppointmentInfo {
  id: string;
  customer_name: string;
  service_name: string;
  location_name: string;
  location_id: string;
  scheduled_time: string;
}

interface QueueInfo {
  position: number;
  estimatedWaitTime: number;
}

const StepCheckInCard = () => {
  const [step, setStep] = useState<'lookup' | 'confirm' | 'success'>('lookup');
  const [lookupMethod, setLookupMethod] = useState<'confirmation' | 'details'>('confirmation');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const navigate = useNavigate();

  const findAppointment = async () => {
    if (lookupMethod === 'confirmation' && !confirmationCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your confirmation code.',
        variant: 'destructive',
      });
      return;
    }

    if (lookupMethod === 'details' && (!lastName.trim() || !phone.trim())) {
      toast({
        title: 'Error',
        description: 'Please enter both last name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    console.log('Finding appointment with method:', lookupMethod);

    try {
      let appointment = null;

      if (lookupMethod === 'confirmation') {
        const code = confirmationCode.trim().toUpperCase();

        if (code.startsWith('CUST-')) {
          // Look up by customer confirmation number
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select(`
              id,
              appointments!appointments_customer_id_fkey(
                id,
                status,
                scheduled_time,
                location_id,
                customers!appointments_customer_id_fkey(first_name, last_name),
                services!appointments_service_id_fkey(name),
                locations!appointments_location_id_fkey(name)
              )
            `)
            .eq('confirmation_number', code)
            .maybeSingle();

          if (customerError) throw customerError;

          if (customerData && customerData.appointments && customerData.appointments.length > 0) {
            const validAppointment = customerData.appointments.find(apt => apt.status === 'scheduled');
            if (validAppointment) {
              appointment = validAppointment;
            }
          }
        } else if (code.startsWith('APT-')) {
          // Look up by appointment ID prefix
          const appointmentIdPrefix = code.substring(4).toLowerCase();
          
          const { data: appointments, error: searchError } = await supabase
            .from('appointments')
            .select(`
              id,
              status,
              scheduled_time,
              location_id,
              customers!appointments_customer_id_fkey(first_name, last_name),
              services!appointments_service_id_fkey(name),
              locations!appointments_location_id_fkey(name)
            `)
            .eq('status', 'scheduled');

          if (searchError) throw searchError;

          appointment = appointments?.find(apt => 
            apt.id.toLowerCase().startsWith(appointmentIdPrefix)
          );
        }
      } else {
        // Look up by customer details
        const cleanPhone = phone.replace(/\D/g, '');
        
        const { data: customers, error: lookupError } = await supabase
          .from('customers')
          .select(`
            id,
            phone,
            appointments!appointments_customer_id_fkey(
              id,
              scheduled_time,
              status,
              location_id,
              services!appointments_service_id_fkey(name),
              locations!appointments_location_id_fkey(name),
              customers!appointments_customer_id_fkey(first_name, last_name)
            )
          `)
          .ilike('last_name', lastName)
          .order('created_at', { ascending: false })
          .limit(10);

        if (lookupError) throw lookupError;

        if (customers && customers.length > 0) {
          const matchingCustomer = customers.find(customer => {
            const customerPhone = customer.phone?.replace(/\D/g, '') || '';
            return customerPhone.includes(cleanPhone) || cleanPhone.includes(customerPhone);
          });

          if (matchingCustomer && matchingCustomer.appointments && matchingCustomer.appointments.length > 0) {
            const validAppointment = matchingCustomer.appointments.find(apt => apt.status === 'scheduled');
            if (validAppointment) {
              appointment = validAppointment;
            }
          }
        }
      }

      if (!appointment) {
        throw new Error('No scheduled appointment found with the provided information');
      }

      console.log('Found appointment:', appointment.id);
      
      setAppointmentInfo({
        id: appointment.id,
        customer_name: `${appointment.customers?.first_name} ${appointment.customers?.last_name}`.trim(),
        service_name: appointment.services?.name || 'Service',
        location_name: appointment.locations?.name || 'Location',
        location_id: appointment.location_id,
        scheduled_time: appointment.scheduled_time
      });

      setStep('confirm');
      
    } catch (error: any) {
      console.error('Error finding appointment:', error);
      toast({
        title: 'Appointment Not Found',
        description: error.message || 'Unable to find appointment. Please verify your information and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const performCheckIn = async () => {
    if (!appointmentInfo) return;

    setIsLoading(true);
    console.log('Checking in appointment:', appointmentInfo.id);

    try {
      // Update appointment status and check-in time
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', appointmentInfo.id);

      if (updateError) throw updateError;

      // Get queue position
      const { data: queueData, error: queueError } = await supabase
        .from('appointments')
        .select('id, check_in_time')
        .eq('location_id', appointmentInfo.location_id)
        .eq('status', 'checked_in')
        .order('check_in_time', { ascending: true });

      if (queueError) throw queueError;

      const position = queueData.findIndex(apt => apt.id === appointmentInfo.id) + 1;
      const estimatedWaitTime = Math.max(0, (position - 1) * 15); // 15 min average per person

      setQueueInfo({ position, estimatedWaitTime });
      setStep('success');

      console.log('Check-in successful, position:', position);
      
    } catch (error: any) {
      console.error('Check-in error:', error);
      toast({
        title: 'Check-in Failed',
        description: error.message || 'Unable to check in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (step === 'lookup') {
        findAppointment();
      } else if (step === 'confirm') {
        performCheckIn();
      }
    }
  };

  const resetForm = () => {
    setStep('lookup');
    setConfirmationCode('');
    setLastName('');
    setPhone('');
    setAppointmentInfo(null);
    setQueueInfo(null);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-6">
      <Card className="shadow-sm">
        {step === 'lookup' && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5" />
                Find Your Appointment
              </CardTitle>
              <CardDescription>
                Enter your confirmation code or contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Method Selection */}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={lookupMethod === 'confirmation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLookupMethod('confirmation')}
                  className="flex-1"
                >
                  Confirmation #
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

              {lookupMethod === 'confirmation' ? (
                <div className="space-y-2">
                  <Label htmlFor="confirmation-code">Confirmation Code</Label>
                  <Input
                    id="confirmation-code"
                    placeholder="CUST-XXXXXXXX or APT-XXXXXXXX"
                    className="text-center font-mono"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Use your customer confirmation number or appointment code
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center text-sm text-gray-500 py-2">
                    – OR –
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                className="w-full" 
                onClick={findAppointment}
                disabled={isLoading || (lookupMethod === 'confirmation' ? !confirmationCode.trim() : !lastName.trim() || !phone.trim())}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Find Appointment'
                )}
              </Button>
            </CardContent>
          </>
        )}

        {step === 'confirm' && appointmentInfo && (
          <>
            <CardHeader className="text-center">
              <CardTitle>Confirm Check-In</CardTitle>
              <CardDescription>
                Please review your appointment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appointment Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border">
                <div className="flex items-start">
                  <User className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{appointmentInfo.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Service</p>
                    <p className="text-sm text-gray-600">{appointmentInfo.service_name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{appointmentInfo.location_name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Scheduled Time</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointmentInfo.scheduled_time).toLocaleString([], { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={performCheckIn}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking In...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check Me In
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'success' && queueInfo && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-green-600">You're checked in!</CardTitle>
              <CardDescription>
                Welcome! Here's your queue information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Queue Position */}
              <div className="text-center bg-blue-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  #{queueInfo.position}
                </div>
                <p className="text-gray-600 mb-4">Your position in line</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                    <p className="text-lg font-semibold">{Math.max(0, queueInfo.position - 1)}</p>
                    <p className="text-xs text-gray-600">ahead of you</p>
                  </div>
                  
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                    <p className="text-lg font-semibold">≈ {queueInfo.estimatedWaitTime}m</p>
                    <p className="text-xs text-gray-600">estimated wait</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>Updates refresh every 30 seconds</p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => navigate('/')}
              >
                Done
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default StepCheckInCard;
