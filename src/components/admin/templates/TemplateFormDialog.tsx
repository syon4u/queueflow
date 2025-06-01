
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getAvailableVariables, formatVariableForDisplay } from '@/utils/template-variables';

interface CommunicationTemplate {
  id?: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  is_active: boolean;
}

interface TemplateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template?: CommunicationTemplate | null;
  onTemplateUpdated: () => void;
}

export const TemplateFormDialog: React.FC<TemplateFormDialogProps> = ({
  isOpen,
  onClose,
  template,
  onTemplateUpdated
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CommunicationTemplate>({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    variables: [],
    is_active: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({ ...template });
    } else {
      setFormData({
        name: '',
        type: 'email',
        subject: '',
        content: '',
        variables: [],
        is_active: true
      });
    }
  }, [template, isOpen]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Template name is required'
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Template content is required'
      });
      return;
    }

    if (formData.type === 'email' && !formData.subject?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email subject is required'
      });
      return;
    }

    setIsSaving(true);
    try {
      const templateData = {
        name: formData.name,
        type: formData.type,
        subject: formData.type === 'email' ? formData.subject : null,
        content: formData.content,
        variables: formData.variables,
        is_active: formData.is_active
      };

      if (template?.id) {
        // Update existing template
        const { error } = await supabase
          .from('communication_templates')
          .update(templateData)
          .eq('id', template.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Template updated successfully'
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from('communication_templates')
          .insert(templateData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Template created successfully'
        });
      }

      onTemplateUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save template'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const availableVariables = getAvailableVariables();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter template name..."
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'email' | 'sms') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter email subject..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={`Enter ${formData.type} content...`}
              rows={8}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active Template</Label>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Available variables:</strong> {availableVariables.map(formatVariableForDisplay).join(', ')}
              <br />
              <small className="text-muted-foreground">
                Use these variables in your template content. They will be automatically replaced with actual values when sending.
              </small>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {template ? 'Update' : 'Create'} Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
