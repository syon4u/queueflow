
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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

interface CustomerInfoStepProps {
  selectedService: Service;
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  selectedService,
  customerInfo,
  onCustomerInfoChange,
  onSubmit,
  onBack
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Your Information</CardTitle>
        <p className="text-center text-muted-foreground">
          Service: <strong>{selectedService.name}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={customerInfo.name}
            onChange={(e) => onCustomerInfoChange({ ...customerInfo, name: e.target.value })}
            placeholder="Enter your full name"
            className="text-lg h-12"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={customerInfo.phone}
            onChange={(e) => onCustomerInfoChange({ ...customerInfo, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="text-lg h-12"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => onCustomerInfoChange({ ...customerInfo, email: e.target.value })}
            placeholder="your.email@example.com"
            className="text-lg h-12"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={onSubmit} className="flex-1">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
