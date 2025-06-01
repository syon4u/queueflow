
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Mail, MessageSquare } from 'lucide-react';
import { Customer } from '@/components/customer/CustomerSearchBox';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

interface ComposeTabProps {
  customer: Customer;
  templates: CommunicationTemplate[];
  onMessageSent: () => void;
  onClose?: () => void;
}

export const ComposeTab: React.FC<ComposeTabProps> = ({
  customer,
  templates,
  onMessageSent,
  onClose
}) => {
  const { toast } = useToast();
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

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
      
      // Notify parent to refresh history and switch tabs
      onMessageSent();
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

  return (
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
  );
};
