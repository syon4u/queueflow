
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Users, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { Customer } from '@/components/customer/CustomerSearchBox';
import { Progress as ProgressBar } from '@/components/ui/progress';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

interface BulkCommunicationProps {
  isOpen: boolean;
  onClose: () => void;
  templates: CommunicationTemplate[];
  preSelectedCustomers?: Customer[];
}

export const BulkCommunication: React.FC<BulkCommunicationProps> = ({
  isOpen,
  onClose,
  templates,
  preSelectedCustomers = []
}) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      if (preSelectedCustomers.length > 0) {
        setSelectedCustomers(preSelectedCustomers.map(c => c.id));
      }
    }
  }, [isOpen, preSelectedCustomers]);

  const fetchCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('first_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load customers'
      });
    } finally {
      setIsLoadingCustomers(false);
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

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    const validCustomers = customers.filter(customer => 
      communicationType === 'email' ? customer.email : customer.phone
    );
    
    if (selectedCustomers.length === validCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(validCustomers.map(c => c.id));
    }
  };

  const handleBulkSend = async () => {
    if (selectedCustomers.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one customer'
      });
      return;
    }

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

    setIsSending(true);
    setSendProgress(0);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedCustomers.length; i++) {
      const customerId = selectedCustomers[i];
      
      try {
        const { error } = await supabase.functions.invoke('send-communication', {
          body: {
            customerId,
            type: communicationType,
            subject: communicationType === 'email' ? subject : undefined,
            message,
            templateId: selectedTemplate || undefined
          }
        });

        if (error) throw error;
        successCount++;
      } catch (error) {
        console.error(`Error sending to customer ${customerId}:`, error);
        failCount++;
      }

      // Update progress
      const progress = ((i + 1) / selectedCustomers.length) * 100;
      setSendProgress(progress);

      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsSending(false);
    setSendProgress(0);

    toast({
      title: 'Bulk Communication Complete',
      description: `${successCount} messages sent successfully, ${failCount} failed`
    });

    if (successCount > 0) {
      // Reset form
      setSelectedCustomers([]);
      setSubject('');
      setMessage('');
      setSelectedTemplate('');
      onClose();
    }
  };

  const validCustomers = customers.filter(customer => 
    communicationType === 'email' ? customer.email : customer.phone
  );

  const selectedValidCustomers = validCustomers.filter(customer => 
    selectedCustomers.includes(customer.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Communication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Communication Type and Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Communication Type</Label>
              <Select value={communicationType} onValueChange={(value: 'email' | 'sms') => setCommunicationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
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

          {/* Subject (Email only) */}
          {communicationType === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="bulk-subject">Subject</Label>
              <Input
                id="bulk-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
              />
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="bulk-message">Message</Label>
            <Textarea
              id="bulk-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Enter your ${communicationType} message...`}
              rows={4}
            />
          </div>

          {/* Customer Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Recipients</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedValidCustomers.length} of {validCustomers.length} customers selected
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={isLoadingCustomers}
                >
                  {selectedCustomers.length === validCustomers.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>

            {isLoadingCustomers ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading customers...</p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {validCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={customer.id}
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => handleCustomerToggle(customer.id)}
                      />
                      <label
                        htmlFor={customer.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {customer.first_name} {customer.last_name}
                        <span className="text-muted-foreground ml-2">
                          ({communicationType === 'email' ? customer.email : customer.phone})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                {validCustomers.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No customers have {communicationType === 'email' ? 'email addresses' : 'phone numbers'} on file
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Send Progress */}
          {isSending && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Sending Progress</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(sendProgress)}%
                </span>
              </div>
              <ProgressBar value={sendProgress} className="w-full" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkSend} 
            disabled={isSending || selectedCustomers.length === 0}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to {selectedValidCustomers.length} Recipients
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
