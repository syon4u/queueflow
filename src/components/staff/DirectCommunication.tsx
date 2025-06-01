
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Mail, Phone, Send, History, FileText } from 'lucide-react';
import { Customer } from '@/components/customer/CustomerSearchBox';
import { ComposeTab } from './communication/ComposeTab';
import { HistoryTab } from './communication/HistoryTab';
import { TemplatesTab } from './communication/TemplatesTab';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

interface DirectCommunicationProps {
  customer: Customer;
  onClose?: () => void;
}

export const DirectCommunication: React.FC<DirectCommunicationProps> = ({
  customer,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'templates'>('compose');
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);

  useEffect(() => {
    fetchTemplates();
  }, [customer.id]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Type cast and parse variables properly
      const typedTemplates: CommunicationTemplate[] = (data || []).map(template => ({
        ...template,
        type: template.type as 'email' | 'sms',
        variables: Array.isArray(template.variables) 
          ? template.variables.map(v => String(v))
          : []
      }));
      
      setTemplates(typedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleMessageSent = () => {
    // Refresh history and switch to history tab
    setRefreshHistoryTrigger(prev => prev + 1);
    setActiveTab('history');
  };

  const handleUseTemplate = (templateId: string) => {
    setActiveTab('compose');
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

        {/* Tab Content */}
        {activeTab === 'compose' && (
          <ComposeTab
            customer={customer}
            templates={templates}
            onMessageSent={handleMessageSent}
            onClose={onClose}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            customer={customer}
            refreshTrigger={refreshHistoryTrigger}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesTab
            templates={templates}
            onUseTemplate={handleUseTemplate}
          />
        )}
      </CardContent>
    </Card>
  );
};
