
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { QueuePositionDisplay } from '@/components/customer/QueuePositionDisplay';

const QueueStatusPage: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchMethod, setSearchMethod] = useState<'confirmation' | 'personal'>('confirmation');
  const [queueInfo, setQueueInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirmationSearch = async () => {
    if (!confirmationCode.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your confirmation code',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - in real implementation, this would call the queue-position function
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setQueueInfo({
        found: true,
        method: 'confirmation',
        confirmationCode: confirmationCode
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to find your appointment. Please check your confirmation code.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoSearch = async () => {
    if (!lastName.trim() || !phoneNumber.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both your last name and phone number',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to search by personal info
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Search by Personal Info',
        description: 'This feature will be implemented to search by last name and phone number',
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to find your appointment. Please check your information.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setQueueInfo(null);
    setConfirmationCode('');
    setLastName('');
    setPhoneNumber('');
  };

  if (queueInfo?.found && queueInfo.method === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" onClick={resetSearch} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Queue Status</h1>
              <p className="text-gray-600">Live updates for your appointment</p>
            </div>
            
            <QueuePositionDisplay confirmationCode={queueInfo.confirmationCode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Check Your Status</h1>
              <p className="text-gray-600">Find your position in the queue</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Find Your Appointment</CardTitle>
              <p className="text-center text-gray-600">
                Use your confirmation code or personal information to check your queue status
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={searchMethod} onValueChange={(value) => setSearchMethod(value as 'confirmation' | 'personal')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="confirmation">Confirmation Code</TabsTrigger>
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="confirmation" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirmation">Confirmation Code</Label>
                    <Input
                      id="confirmation"
                      placeholder="Enter your confirmation code (e.g., QF-A1B2C3D4)"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className="text-center text-lg"
                    />
                    <p className="text-sm text-gray-500">
                      You received this code when you booked your appointment
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleConfirmationSearch}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? 'Searching...' : 'Check Status'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePersonalInfoSearch}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? 'Searching...' : 'Find My Appointment'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Can't find your confirmation code?</h4>
                  <p className="text-sm text-gray-600">
                    Check your email or text messages. The code starts with "QF-" followed by 8 characters.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Multiple appointments?</h4>
                  <p className="text-sm text-gray-600">
                    Each appointment has its own confirmation code. Use the specific code for the appointment you want to check.
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Still having trouble? <Link to="/contact" className="text-blue-600 hover:underline">Contact support</Link> for assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueueStatusPage;
