
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
      const { data, error } = await supabase.functions.invoke('appointments/check-in', {
        body: {
          confirmation_code: confirmationCode.trim().toUpperCase()
        }
      });

      if (error) {
        console.error('CheckInCard - Check-in error:', error);
        toast({
          title: 'Check-in Failed',
          description: error.message || 'Unable to check in. Please verify your confirmation code.',
          variant: 'destructive',
        });
        return;
      }

      console.log('CheckInCard - Check-in successful:', data);
      
      toast({
        title: 'Check-in Successful!',
        description: 'You have been successfully checked in for your appointment.',
      });

      // Clear the form
      setConfirmationCode('');
      
    } catch (error: any) {
      console.error('CheckInCard - Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
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
