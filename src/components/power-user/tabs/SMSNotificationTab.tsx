
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Send, Users, Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SMSNotificationTab: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [recipientType, setRecipientType] = useState('all');

  // Mock data for demonstration
  const templates = [
    { id: '1', name: 'Appointment Reminder', content: 'Hi {customer_name}, your appointment is scheduled for {appointment_time}.' },
    { id: '2', name: 'Check-in Notification', content: 'Hello {customer_name}, please check in for your appointment.' },
    { id: '3', name: 'Service Complete', content: 'Thank you {customer_name}, your service is complete.' },
    { id: '4', name: 'Queue Update', content: 'Hi {customer_name}, you are now #{queue_position} in line.' },
  ];

  const recentMessages = [
    { id: '1', recipient: 'John Doe', message: 'Appointment reminder sent', status: 'delivered', time: '2 mins ago' },
    { id: '2', recipient: 'Jane Smith', message: 'Check-in notification', status: 'pending', time: '5 mins ago' },
    { id: '3', recipient: 'Bob Johnson', message: 'Service complete notification', status: 'delivered', time: '10 mins ago' },
    { id: '4', recipient: 'All customers', message: 'System maintenance notification', status: 'delivered', time: '1 hour ago' },
  ];

  const stats = {
    sent: 1247,
    delivered: 1198,
    pending: 12,
    failed: 37,
  };

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Message sent to ${recipientType === 'all' ? 'all customers' : 'selected recipients'}`,
    });

    setMessageContent('');
  };

  const handleSendTemplate = () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a template",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template Sent",
      description: "Template message sent successfully",
    });
  };

  const handleCreateTemplate = () => {
    toast({
      title: "Create Template",
      description: "Template creation form would open here",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">SMS & Notifications</h2>
          <p className="text-gray-600">Manage communication templates and send notifications to customers</p>
        </div>
        <Button onClick={handleCreateTemplate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Messages Sent</p>
                <p className="text-3xl font-bold text-blue-900">{stats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Delivered</p>
                <p className="text-3xl font-bold text-green-900">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-900">{stats.failed}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Messages */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-blue-600" />
              Send Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="compose" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="compose" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Recipients</label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="today">Today's Appointments</SelectItem>
                      <SelectItem value="waiting">Waiting Queue</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {messageContent.length}/160 characters
                  </p>
                </div>
                
                <Button onClick={handleSendMessage} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Select Template</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedTemplate && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Preview:</p>
                    <p className="text-sm mt-1">
                      {templates.find(t => t.id === selectedTemplate)?.content}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Recipients</label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="today">Today's Appointments</SelectItem>
                      <SelectItem value="waiting">Waiting Queue</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleSendTemplate} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Template
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
                Recent Messages
              </CardTitle>
              <Badge variant="outline">{recentMessages.length} messages</Badge>
            </div>
            
            <div className="relative mt-4">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {recentMessages.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === recentMessages.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm">{message.recipient}</p>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(message.status)} text-xs border-0`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(message.status)}
                            {message.status}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{message.message}</p>
                      <p className="text-xs text-gray-500">{message.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Templates */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Message Templates</CardTitle>
            <Button variant="outline" onClick={handleCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <Card key={template.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Use</Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{template.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
