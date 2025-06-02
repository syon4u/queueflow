
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, CheckCircle } from 'lucide-react';

const CheckInCard = () => {
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
            placeholder="Enter your appointment code"
            className="text-center font-mono"
          />
        </div>
        
        <Button className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          Check In
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Don't have a code? Schedule an appointment above.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInCard;
