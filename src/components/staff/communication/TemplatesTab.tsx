
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, FileText } from 'lucide-react';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

interface TemplatesTabProps {
  templates: CommunicationTemplate[];
  onUseTemplate: (templateId: string) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  templates,
  onUseTemplate
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No templates available</p>
        <p className="text-sm">Contact your administrator to add communication templates</p>
      </div>
    );
  }

  return (
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
              onClick={() => onUseTemplate(template.id)}
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
  );
};
