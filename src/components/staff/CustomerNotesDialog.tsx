
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Plus, Star, FileText, Calendar } from 'lucide-react';

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
      
      console.log('Fetching notes for customer:', customerId);
      
      const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
      
      console.log('Fetched notes:', data);
      return data || [];
    },
    enabled: !!customerId
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async () => {
      if (!customerId || !noteText.trim()) return;

      console.log('Adding note for customer:', customerId);

      const { error } = await supabase
        .from('customer_notes')
        .insert({
          customer_id: customerId,
          note: noteText.trim(),
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          is_important: isImportant
        });

      if (error) {
        console.error('Error adding note:', error);
        throw error;
      }
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('notes.customerNotes')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Note Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          <Separator />

          {/* Notes List */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('notes.existingNotes')}
            </h3>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : notes && notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note: CustomerNote) => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
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
                      
                      <p className="text-sm mb-3 leading-relaxed">{note.note}</p>
                      
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notes Found</h3>
                  <p className="text-gray-500 mb-4">
                    {t('notes.noNotes')}
                  </p>
                  <Button onClick={() => setIsAddingNote(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Note
                  </Button>
                </CardContent>
              </Card>
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
