
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, Clock, User, Edit, Save, X, Trash2 } from 'lucide-react';
import { CustomerNote } from '@/types/customer-notes';
import { format } from 'date-fns';

interface CustomerNoteCardProps {
  note: CustomerNote;
  onUpdate: () => void;
}

export const CustomerNoteCard: React.FC<CustomerNoteCardProps> = ({
  note,
  onUpdate
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.note);
  const [editCategory, setEditCategory] = useState(note.category);
  const [isImportant, setIsImportant] = useState(note.is_important);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'appointment', label: 'Appointment' },
    { value: 'service', label: 'Service' },
    { value: 'payment', label: 'Payment' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      appointment: 'bg-blue-100 text-blue-800',
      service: 'bg-green-100 text-green-800',
      payment: 'bg-yellow-100 text-yellow-800',
      complaint: 'bg-red-100 text-red-800',
      'follow-up': 'bg-purple-100 text-purple-800',
      emergency: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Note content cannot be empty'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('customer_notes')
        .update({
          note: editContent,
          category: editCategory,
          is_important: isImportant,
          updated_at: new Date().toISOString()
        })
        .eq('id', note.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Note updated successfully'
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update note'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('customer_notes')
        .delete()
        .eq('id', note.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Note deleted successfully'
      });

      onUpdate();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete note'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setEditContent(note.note);
    setEditCategory(note.category);
    setIsImportant(note.is_important);
    setIsEditing(false);
  };

  return (
    <Card className={`${note.is_important ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(note.category)}>
                {categories.find(c => c.value === note.category)?.label || note.category}
              </Badge>
              {note.is_important && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {!isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`important-${note.id}`}
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor={`important-${note.id}`} className="text-sm">
                    Important
                  </label>
                </div>
              </div>
              
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
              />
              
              <div className="flex gap-2">
                <Button onClick={handleUpdate} disabled={isUpdating} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm leading-relaxed">{note.note}</p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {note.staff ? `${note.staff.first_name} ${note.staff.last_name}` : 'Unknown Staff'}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(note.created_at), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
            
            {note.updated_at !== note.created_at && (
              <div className="text-xs text-muted-foreground">
                Updated {format(new Date(note.updated_at), 'MMM dd, HH:mm')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
