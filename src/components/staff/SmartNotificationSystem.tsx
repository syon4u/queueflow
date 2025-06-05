
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Send,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  name: string;
  trigger: 'time_based' | 'status_change' | 'queue_position' | 'wait_time';
  condition: string;
  channels: ('sms' | 'email' | 'voice' | 'push')[];
  template: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface NotificationHistory {
  id: string;
  customer_name: string;
  channel: string;
  message: string;
  sent_at: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  retry_count: number;
}

export const SmartNotificationSystem: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rules');
  
  // Sample notification rules
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Appointment Reminder - 24h',
      trigger: 'time_based',
      condition: '24 hours before appointment',
      channels: ['sms', 'email'],
      template: 'reminder_24h',
      enabled: true,
      priority: 'medium'
    },
    {
      id: '2',
      name: 'Queue Position Update',
      trigger: 'queue_position',
      condition: 'Position changes to #3 or less',
      channels: ['sms', 'push'],
      template: 'queue_position_update',
      enabled: true,
      priority: 'high'
    },
    {
      id: '3',
      name: 'Long Wait Alert',
      trigger: 'wait_time',
      condition: 'Wait time exceeds 30 minutes',
      channels: ['sms', 'voice'],
      template: 'long_wait_apology',
      enabled: true,
      priority: 'high'
    },
    {
      id: '4',
      name: 'Service Ready',
      trigger: 'status_change',
      condition: 'Status changes to "called"',
      channels: ['sms', 'voice', 'push'],
      template: 'service_ready',
      enabled: true,
      priority: 'critical'
    }
  ]);

  // Sample notification history
  const [notificationHistory] = useState<NotificationHistory[]>([
    {
      id: '1',
      customer_name: 'John Smith',
      channel: 'SMS',
      message: 'Your appointment is tomorrow at 2:00 PM',
      sent_at: '2024-01-15T10:30:00Z',
      status: 'delivered',
      retry_count: 0
    },
    {
      id: '2',
      customer_name: 'Sarah Johnson',
      channel: 'Voice',
      message: 'You are now being called for service',
      sent_at: '2024-01-15T11:15:00Z',
      status: 'failed',
      retry_count: 2
    },
    {
      id: '3',
      customer_name: 'Mike Davis',
      channel: 'Email',
      message: 'Queue position update: You are now #2 in line',
      sent_at: '2024-01-15T11:45:00Z',
      status: 'sent',
      retry_count: 0
    }
  ]);

  const toggleRule = (ruleId: string) => {
    setNotificationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    toast({
      title: 'Notification Rule Updated',
      description: 'Rule status has been changed.',
    });
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'voice': return <Phone className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Smart Notification System</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          🔔 {notificationRules.filter(r => r.enabled).length} Active Rules
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Notification Rules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Notification Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge className={getPriorityColor(rule.priority)}>
                          {rule.priority}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-gray-500">TRIGGER</Label>
                        <p className="font-medium">{rule.trigger.replace('_', ' ')}</p>
                        <p className="text-gray-600">{rule.condition}</p>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">CHANNELS</Label>
                        <div className="flex gap-2 mt-1">
                          {rule.channels.map((channel) => (
                            <div key={channel} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                              {getChannelIcon(channel)}
                              <span className="text-xs">{channel}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">TEMPLATE</Label>
                        <p className="font-medium">{rule.template}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Add New Notification Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationHistory.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(notification.status)}
                        <div>
                          <h4 className="font-medium">{notification.customer_name}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getChannelIcon(notification.channel)}
                          <span className="text-sm font-medium">{notification.channel}</span>
                          <Badge variant="outline">{notification.status}</Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.sent_at).toLocaleString()}
                        </p>
                        {notification.retry_count > 0 && (
                          <p className="text-xs text-orange-600">
                            Retried {notification.retry_count} times
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">24-Hour Reminder</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Hi {'{customer_name}'}, your appointment is scheduled for tomorrow at {'{appointment_time}'}. Please arrive 15 minutes early.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Test</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Service Ready</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {'{customer_name}'}, you are now being called for service. Please proceed to counter #{'{counter_number}'}.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Test</Button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Create New Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable Auto-Retry</Label>
                      <p className="text-sm text-gray-600">Automatically retry failed notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Smart Timing</Label>
                      <p className="text-sm text-gray-600">Optimize notification timing based on customer preferences</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Max Retry Attempts</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="2">2 attempts</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Retry Delay (minutes)</Label>
                      <Input type="number" defaultValue="5" min="1" max="60" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
