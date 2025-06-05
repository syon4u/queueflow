
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export const SMSNotificationTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('compose');

  // Mock data
  const templates = [
    { id: '1', name: 'Appointment Reminder', content: 'Your appointment is scheduled for {date} at {time}', active: true },
    { id: '2', name: 'Queue Update', content: 'You are now #{position} in the queue', active: true },
    { id: '3', name: 'Service Complete', content: 'Thank you for visiting us today!', active: false },
  ];

  const messageLog = [
    { id: '1', recipient: '+1234567890', message: 'Appointment reminder sent', status: 'delivered', time: '2 hours ago' },
    { id: '2', recipient: '+1987654321', message: 'Queue position update', status: 'failed', time: '3 hours ago' },
    { id: '3', recipient: '+1122334455', message: 'Service completion notice', status: 'delivered', time: '4 hours ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">SMS & Notification Center</h2>
          <p className="text-sm text-gray-500">Manage SMS templates, send messages, and view delivery logs</p>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Delivery Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipients</label>
                <Input placeholder="Enter phone numbers (comma separated)" />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Type your message here..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">160 characters remaining</p>
              </div>
              <div className="flex gap-3">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
                <Button variant="outline">Schedule</Button>
                <Button variant="outline">Save as Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Message Templates</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>

            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{template.name}</h4>
                          <Badge variant={template.active ? 'default' : 'secondary'}>
                            {template.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{template.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Message Delivery Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messageLog.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <span className="font-medium">{log.recipient}</span>
                        <Badge variant={log.status === 'delivered' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                    </div>
                    <span className="text-sm text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
