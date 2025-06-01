
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Plus, Star } from 'lucide-react';

interface CustomerNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string | null;
}

interface CustomerNote {
  id: string;
  note: string;
  category: string;
  tags: string[];
  is_important: boolean;
  staff_id: string;
  created_at: string;
}

export const CustomerNotesDialog: React.FC<CustomerNotesDialogProps> = ({
  open,
  onOpenChange,
  customerId
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  // Fetch customer notes
  const { data: notes, isLoading } = useQuery({
    queryKey: ['customer-notes', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      
      const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!customerId
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async () => {
      if (!customerId || !noteText.trim()) return;

      const { error } = await supabase
        .from('customer_notes')
        .insert({
          customer_id: customerId,
          note: noteText.trim(),
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          is_important: isImportant
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerId] });
      toast({
        title: t('common.success'),
        description: t('notes.noteAdded'),
      });
      setNoteText('');
      setTags('');
      setIsImportant(false);
      setIsAddingNote(false);
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t('notes.addError'),
        variant: 'destructive',
      });
      console.error('Error adding note:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNoteMutation.mutate();
  };

  const categories = [
    'general',
    'medical',
    'preference',
    'complaint',
    'compliment',
    'special_needs'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('notes.customerNotes')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Note Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('notes.addNote')}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingNote(!isAddingNote)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('notes.new')}
              </Button>
            </div>

            {isAddingNote && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="category">{t('notes.category')}</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {t(`notes.categories.${cat}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">{t('notes.tags')}</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder={t('notes.tagsPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="note">{t('notes.note')}</Label>
                  <Textarea
                    id="note"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder={t('notes.notePlaceholder')}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="important"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="important">{t('notes.markImportant')}</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={addNoteMutation.isPending || !noteText.trim()}>
                    {addNoteMutation.isPending ? t('common.saving') : t('notes.saveNote')}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingNote(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <Separator />

          {/* Notes List */}
          <div className="space-y-3">
            <h3 className="font-medium">{t('notes.existingNotes')}</h3>
            
            {isLoading ? (
              <div className="text-center py-4">{t('common.loading')}</div>
            ) : notes && notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note: CustomerNote) => (
                  <div key={note.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{t(`notes.categories.${note.category}`)}</Badge>
                        {note.is_important && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(note.created_at), 'PPp')}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">{note.note}</p>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('notes.noNotes')}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
