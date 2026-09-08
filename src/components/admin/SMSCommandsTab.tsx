
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Clock, X } from 'lucide-react';
import { useSMSCommands } from '@/hooks/use-sms-commands';

export const SMSCommandsTab: React.FC = () => {
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const { processSMSCommand, isProcessing } = useSMSCommands();

  const handleTestCommand = async () => {
    if (!testPhone || !testMessage) return;
    
    const result = await processSMSCommand(testPhone, testMessage);
    setTestResult(result);
  };

  const supportedCommands = [
    {
      command: 'R',
      description: 'Get appointment status and details',
      example: 'R'
    },
    {
      command: 'LATE X',
      description: 'Report delay (X = minutes)',
      example: 'LATE 10'
    },
    {
      command: 'CANCEL',
      description: 'Cancel appointment',
      example: 'CANCEL'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Way SMS Commands</h2>
        <p className="text-gray-600">
          Preview how customer text-message commands will be answered.
        </p>
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Not yet live.</strong> No SMS number is connected to this deployment, so customers cannot
          text these commands yet. The simulator below runs the same command parser against your live
          appointment data.
        </div>
      </div>

      {/* Command Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Supported Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportedCommands.map((cmd, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {cmd.command}
                  </Badge>
                  <span className="text-sm">{cmd.description}</span>
                </div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {cmd.example}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Command Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sms-test-phone" className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                id="sms-test-phone"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="Enter phone number..."
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="sms-test-message" className="block text-sm font-medium mb-2">SMS Message</label>
              <div className="flex gap-2">
                <Input
                  id="sms-test-message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter command (R, LATE 10, CANCEL)..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleTestCommand}
                  disabled={isProcessing || !testPhone || !testMessage}
                >
                  Test
                </Button>
              </div>
            </div>
          </div>

          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Test Result:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTestResult(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Command:</strong> <code>{testResult.command}</code>
                </div>
                <div>
                  <strong>Response:</strong> {testResult.response}
                </div>
                {testResult.appointment && (
                  <div className="text-sm text-gray-600">
                    <strong>Appointment ID:</strong> {testResult.appointment.id}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Setup Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <strong>Webhook URL:</strong>
              <code className="block mt-1 text-xs bg-white p-2 rounded border">
                https://diadwozorwkzhexhjfgb.supabase.co/functions/v1/sms-webhook
              </code>
            </div>
            <p className="text-gray-600">
              Configure this URL in your Twilio webhook settings to enable two-way SMS functionality.
            </p>
            <p className="text-gray-600">
              Commands are case-insensitive and will work for customers with existing appointments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
