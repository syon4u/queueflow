
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, MessageSquare, Mail, Phone, History, FileText } from 'lucide-react';
import { Customer } from '@/components/customer/CustomerSearchBox';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface DirectCommunicationProps {
  customer: Customer;
  onClose?: () => void;
}

export const DirectCommunication: React.FC<DirectCommunicationProps> = ({
  customer,
  onClose
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'templates'>('compose');
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [history, setHistory] = useState<CommunicationHistory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchCommunicationHistory();
  }, [customer.id]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Type cast and parse variables
      const typedTemplates: CommunicationTemplate[] = (data || []).map(template => ({
        ...template,
        type: template.type as 'email' | 'sms',
        variables: Array.isArray(template.variables) ? template.variables : []
      }));
      
      setTemplates(typedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCommunicationHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch staff details for each communication
      const historyWithStaff: CommunicationHistory[] = [];
      for (const comm of data || []) {
        let staff = null;
        if (comm.staff_id) {
          const { data: staffData } = await supabase
            .from('staff')
            .select('first_name, last_name')
            .eq('id', comm.staff_id)
            .single();
          staff = staffData;
        }
        historyWithStaff.push({ 
          ...comm, 
          type: comm.type as 'email' | 'sms',
          staff 
        });
      }

      setHistory(historyWithStaff);
    } catch (error) {
      console.error('Error fetching communication history:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load communication history'
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCommunicationType(template.type);
      setSubject(template.subject || '');
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{customer_name\}\}/g, `${customer.first_name} ${customer.last_name}`)
      .replace(/\{\{first_name\}\}/g, customer.first_name)
      .replace(/\{\{last_name\}\}/g, customer.last_name);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Message content is required'
      });
      return;
    }

    if (communicationType === 'email' && !subject.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email subject is required'
      });
      return;
    }

    // Check if customer has the required contact information
    if (communicationType === 'email' && !customer.email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Customer email address not available'
      });
      return;
    }

    if (communicationType === 'sms' && !customer.phone) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Customer phone number not available'
      });
      return;
    }

    setIsSending(true);
    try {
      const processedMessage = replaceVariables(message);
      const processedSubject = communicationType === 'email' ? replaceVariables(subject) : undefined;

      const { error } = await supabase.functions.invoke('send-communication', {
        body: {
          customerId: customer.id,
          type: communicationType,
          subject: processedSubject,
          message: processedMessage,
          templateId: selectedTemplate || undefined
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${communicationType === 'email' ? 'Email' : 'SMS'} sent successfully`
      });

      // Clear form
      setSubject('');
      setMessage('');
      setSelectedTemplate('');
      
      // Refresh history
      fetchCommunicationHistory();
      
      // Switch to history tab to show the sent message
      setActiveTab('history');
    } catch (error) {
      console.error('Error sending communication:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message'
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Communication - {customer.first_name} {customer.last_name}
        </CardTitle>
        <div className="flex gap-2 text-sm text-muted-foreground">
          {customer.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {customer.email}
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {customer.phone}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b">
          <Button
            variant={activeTab === 'compose' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('compose')}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Compose
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            History
          </Button>
          <Button
            variant={activeTab === 'templates' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('templates')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Templates
          </Button>
        </div>

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Communication Type</Label>
                <Select value={communicationType} onValueChange={(value: 'email' | 'sms') => setCommunicationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email" disabled={!customer.email}>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email {!customer.email && '(Not available)'}
                      </div>
                    </SelectItem>
                    <SelectItem value="sms" disabled={!customer.phone}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS {!customer.phone && '(Not available)'}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Use Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates
                      .filter(t => t.type === communicationType)
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {communicationType === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Enter your ${communicationType} message...`}
                rows={6}
              />
              <div className="text-sm text-muted-foreground">
                Available variables: {`{{customer_name}}, {{first_name}}, {{last_name}}`}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSend} disabled={isSending || !message.trim()}>
                {isSending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send {communicationType === 'email' ? 'Email' : 'SMS'}
                  </>
                )}
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading communication history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No communication history found</p>
                <p className="text-sm">Send your first message to this customer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((comm) => (
                  <Card key={comm.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {comm.type === 'email' ? (
                          <Mail className="h-4 w-4 text-blue-500" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-green-500" />
                        )}
                        <Badge variant={comm.status === 'sent' ? 'default' : 'secondary'}>
                          {comm.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comm.created_at)}
                        </span>
                      </div>
                      {comm.staff && (
                        <span className="text-sm text-muted-foreground">
                          by {comm.staff.first_name} {comm.staff.last_name}
                        </span>
                      )}
                    </div>
                    {comm.subject && (
                      <div className="font-medium text-sm mb-1">
                        Subject: {comm.subject}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {comm.message}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No templates available</p>
                <p className="text-sm">Contact your administrator to add communication templates</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {template.type === 'email' ? (
                          <Mail className="h-4 w-4 text-blue-500" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium">{template.name}</span>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleTemplateSelect(template.id);
                          setActiveTab('compose');
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                    {template.subject && (
                      <div className="font-medium text-sm mb-1">
                        Subject: {template.subject}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {template.content.length > 200 
                        ? `${template.content.substring(0, 200)}...`
                        : template.content
                      }
                    </div>
                    {template.variables.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Variables: {template.variables.join(', ')}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
