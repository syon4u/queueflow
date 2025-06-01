
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DataTable, Column } from './DataTable';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

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

interface TemplateFormData {
  name: string;
  type: 'email' | 'sms';
  subject: string;
  content: string;
  variables: string;
  is_active: boolean;
}

export const CommunicationTemplatesTab: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    variables: '',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load communication templates'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Name and content are required'
      });
      return;
    }

    if (formData.type === 'email' && !formData.subject.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Subject is required for email templates'
      });
      return;
    }

    try {
      const variables = formData.variables
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);

      const templateData = {
        name: formData.name,
        type: formData.type,
        subject: formData.type === 'email' ? formData.subject : null,
        content: formData.content,
        variables: variables,
        is_active: formData.is_active
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('communication_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Template updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('communication_templates')
          .insert(templateData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Template created successfully'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save template'
      });
    }
  };

  const handleDeleteTemplate = async (template: CommunicationTemplate) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('communication_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Template deleted successfully'
      });

      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete template'
      });
    }
  };

  const handleEditTemplate = (template: CommunicationTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject || '',
      content: template.content,
      variables: template.variables.join(', '),
      is_active: template.is_active
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'email',
      subject: '',
      content: '',
      variables: '',
      is_active: true
    });
    setEditingTemplate(null);
  };

  const handleAddTemplate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (template: CommunicationTemplate) => (
        <div className="flex items-center gap-2">
          {template.type === 'email' ? (
            <Mail className="h-4 w-4 text-blue-500" />
          ) : (
            <MessageSquare className="h-4 w-4 text-green-500" />
          )}
          <span className="font-medium">{template.name}</span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      cell: (template: CommunicationTemplate) => (
        <Badge variant="outline">
          {template.type.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'subject',
      header: 'Subject',
      cell: (template: CommunicationTemplate) => (
        <span className="text-sm text-muted-foreground">
          {template.subject || 'N/A'}
        </span>
      )
    },
    {
      key: 'content',
      header: 'Content Preview',
      cell: (template: CommunicationTemplate) => (
        <span className="text-sm text-muted-foreground">
          {template.content.length > 50 
            ? `${template.content.substring(0, 50)}...`
            : template.content
          }
        </span>
      )
    },
    {
      key: 'variables',
      header: 'Variables',
      cell: (template: CommunicationTemplate) => (
        <span className="text-xs text-muted-foreground">
          {template.variables.length > 0 
            ? template.variables.join(', ')
            : 'None'
          }
        </span>
      )
    },
    {
      key: 'is_active',
      header: 'Status',
      cell: (template: CommunicationTemplate) => (
        <Badge variant={template.is_active ? 'default' : 'secondary'}>
          {template.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Communication Templates</h2>
          <p className="text-muted-foreground">
            Manage email and SMS templates for staff communications
          </p>
        </div>
        <Button onClick={handleAddTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <DataTable
        data={templates}
        columns={columns}
        onEditClick={handleEditTemplate}
        onDeleteClick={handleDeleteTemplate}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'email' | 'sms') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
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
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter template content..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variables">Variables (comma-separated)</Label>
              <Input
                id="variables"
                value={formData.variables}
                onChange={(e) => setFormData(prev => ({ ...prev, variables: e.target.value }))}
                placeholder="customer_name, first_name, last_name"
              />
              <p className="text-xs text-muted-foreground">
                Available variables: customer_name, first_name, last_name
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
