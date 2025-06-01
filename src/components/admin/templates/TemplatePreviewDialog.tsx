
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';
import { replaceTemplateVariables, type VariableContext } from '@/utils/template-variables';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: CommunicationTemplate | null;
}

export const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  isOpen,
  onClose,
  template
}) => {
  if (!template) return null;

  // Sample context for preview
  const sampleContext: VariableContext = {
    customer_name: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    appointment_time: '2024-06-01 2:00 PM',
    service_name: 'Document Review',
    location_name: 'Main Office',
    queue_position: '3',
    estimated_wait: '15 minutes'
  };

  const previewSubject = template.subject ? replaceTemplateVariables(template.subject, sampleContext) : '';
  const previewContent = replaceTemplateVariables(template.content, sampleContext);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {template.type === 'email' ? (
              <Mail className="h-5 w-5" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
            Template Preview: {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant={template.type === 'email' ? 'default' : 'secondary'}>
              {template.type}
            </Badge>
            <Badge variant={template.is_active ? 'default' : 'outline'}>
              {template.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Raw Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {template.subject && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Subject:</p>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    {template.subject}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground">Content:</p>
                <p className="text-sm font-mono bg-muted p-2 rounded whitespace-pre-wrap">
                  {template.content}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Preview with Sample Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {template.subject && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Subject:</p>
                  <p className="text-sm bg-blue-50 border border-blue-200 p-2 rounded">
                    {previewSubject}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground">Content:</p>
                <div className="text-sm bg-blue-50 border border-blue-200 p-3 rounded whitespace-pre-wrap">
                  {previewContent}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Sample Data Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><strong>Customer Name:</strong> {sampleContext.customer_name}</div>
                <div><strong>First Name:</strong> {sampleContext.first_name}</div>
                <div><strong>Last Name:</strong> {sampleContext.last_name}</div>
                <div><strong>Appointment Time:</strong> {sampleContext.appointment_time}</div>
                <div><strong>Service Name:</strong> {sampleContext.service_name}</div>
                <div><strong>Location Name:</strong> {sampleContext.location_name}</div>
                <div><strong>Queue Position:</strong> {sampleContext.queue_position}</div>
                <div><strong>Estimated Wait:</strong> {sampleContext.estimated_wait}</div>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            <p><strong>Created:</strong> {new Date(template.created_at).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(template.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
