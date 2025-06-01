
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCommunication } from '@/hooks/use-communication';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import type { Appointment } from '@/hooks/use-appointments';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
}

interface CommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export const CommunicationDialog: React.FC<CommunicationDialogProps> = ({
  open,
  onOpenChange,
  appointment
}) => {
  const { t } = useTranslation();
  const { sendCommunication, isLoading } = useCommunication();
  const [type, setType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (!templateId) {
      setSelectedTemplate('');
      return;
    }

    const template = templates.find(t => t.id === templateId);
    if (template) {
      setType(template.type);
      setSubject(template.subject || '');
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    try {
      await sendCommunication({
        customerId: appointment.customer_id,
        type,
        subject: type === 'email' ? subject : undefined,
        message,
        templateId: selectedTemplate || undefined
      });

      onOpenChange(false);
      setSubject('');
      setMessage('');
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error sending communication:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSubject('');
    setMessage('');
    setSelectedTemplate('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('communication.sendToCustomer')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label>{t('communication.template', 'Template (Optional)')}</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No template</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Communication Type */}
          <div className="space-y-2">
            <Label>{t('communication.type')}</Label>
            <Select value={type} onValueChange={(value: 'email' | 'sms') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">{t('communication.email')}</SelectItem>
                <SelectItem value="sms">{t('communication.sms')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject (Email only) */}
          {type === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">{t('communication.subject')}</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('communication.subjectPlaceholder')}
                required
              />
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">{t('communication.message')}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('communication.messagePlaceholder')}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !message}>
              {isLoading ? t('common.sending') : t('communication.send')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
