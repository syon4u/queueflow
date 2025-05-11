
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const SystemSettingsTab: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoAssignments, setAutoAssignments] = React.useState(false);
  const [waitTimeEstimates, setWaitTimeEstimates] = React.useState(true);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure system-wide settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Customer Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable SMS and email notifications
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-assignments">Auto Staff Assignments</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign staff to appointments
                </p>
              </div>
              <Switch
                id="auto-assignments"
                checked={autoAssignments}
                onCheckedChange={setAutoAssignments}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="wait-times">Wait Time Estimates</Label>
                <p className="text-sm text-muted-foreground">
                  Show estimated wait times to customers
                </p>
              </div>
              <Switch
                id="wait-times"
                checked={waitTimeEstimates}
                onCheckedChange={setWaitTimeEstimates}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="business-name">Organization Name</Label>
              <Input id="business-name" defaultValue="County Service Center" />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" defaultValue="contact@serviceorg.gov" />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="support-phone">Support Phone</Label>
              <Input id="support-phone" defaultValue="(555) 123-4567" />
            </div>
            
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Integration</CardTitle>
            <CardDescription>API keys and external service configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="sms-key">SMS API Key</Label>
              <Input id="sms-key" type="password" defaultValue="sk_test_123456789" />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="api-key">Public API Key</Label>
              <Input id="api-key" defaultValue="pk_live_87654321" />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input id="webhook" defaultValue="https://api.serviceorg.gov/webhooks/queue" />
            </div>
            
            <Button className="w-full">Update Integration Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
