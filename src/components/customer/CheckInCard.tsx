
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const CheckInCard = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckIn = async () => {
    if (!confirmationCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your confirmation code.',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    console.log('CheckInCard - Attempting check-in with code:', confirmationCode);

    try {
      // Use direct database query instead of edge function for better reliability
      let appointment = null;
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
              customers!appointments_customer_id_fkey(first_name, last_name)
            )
          `)
          .eq('confirmation_number', code)
          .maybeSingle();

        if (customerError) {
          console.error('CheckInCard - Customer lookup error:', customerError);
          throw new Error('Unable to find customer record');
        }

        if (customerData && customerData.appointments && customerData.appointments.length > 0) {
          // Find valid appointment (within reasonable time range - 7 days)
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          const validAppointment = customerData.appointments.find(apt => {
            const aptDate = new Date(apt.scheduled_time);
            return apt.status === 'scheduled' && aptDate >= weekAgo && aptDate <= weekFromNow;
          });

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
            customers!appointments_customer_id_fkey(first_name, last_name)
          `)
          .eq('status', 'scheduled')
          .gte('scheduled_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
          .lte('scheduled_time', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()); // Next 7 days

        if (searchError) {
          console.error('CheckInCard - Appointment search error:', searchError);
          throw new Error('Unable to search for appointment');
        }

        const matchingAppointment = appointments?.find(apt => 
          apt.id.toLowerCase().startsWith(appointmentIdPrefix)
        );

        if (matchingAppointment) {
          appointment = matchingAppointment;
        }
      } else {
        throw new Error('Invalid confirmation code format. Use CUST-XXXXXXXX or APT-XXXXXXXX format.');
      }

      if (!appointment) {
        throw new Error('No scheduled appointment found with the provided confirmation code');
      }

      console.log('CheckInCard - Found appointment:', appointment.id);

      // Update appointment status and check-in time
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', appointment.id);

      if (updateError) {
        console.error('CheckInCard - Update error:', updateError);
        throw new Error('Failed to check in. Please try again.');
      }

      console.log('CheckInCard - Check-in successful for appointment:', appointment.id);
      
      toast({
        title: 'Check-in Successful!',
        description: `Welcome ${appointment.customers?.first_name} ${appointment.customers?.last_name}! You have been checked in.`,
      });

      // Clear the form
      setConfirmationCode('');
      
    } catch (error: any) {
      console.error('CheckInCard - Error:', error);
      toast({
        title: 'Check-in Failed',
        description: error.message || 'Unable to check in. Please verify your confirmation code and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking) {
      handleCheckIn();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Quick Check-In
        </CardTitle>
        <CardDescription>
          Enter your confirmation code to check in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="confirmation-code">Confirmation Code</Label>
          <Input
            id="confirmation-code"
            placeholder="CUST-XXXXXXXX or APT-XXXXXXXX"
            className="text-center font-mono"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isChecking}
          />
          <p className="text-xs text-gray-500">
            Use your customer confirmation number (CUST-XXXXXXXX) or appointment code (APT-XXXXXXXX)
          </p>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleCheckIn}
          disabled={isChecking || !confirmationCode.trim()}
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking In...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Check In
            </>
          )}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Don't have a code? Schedule an appointment above.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInCard;
