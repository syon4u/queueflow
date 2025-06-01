
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Filter, Star, Clock, User } from 'lucide-react';
import { CustomerNote, CreateNoteData } from '@/types/customer-notes';
import { CustomerNoteCard } from './CustomerNoteCard';
import { NoteFilters } from './NoteFilters';

interface CustomerNotesManagerProps {
  customerId: string;
  customerName: string;
}

export const CustomerNotesManager: React.FC<CustomerNotesManagerProps> = ({
  customerId,
  customerName
}) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [newNote, setNewNote] = useState<CreateNoteData>({
    note: '',
    category: 'general',
    tags: [],
    is_important: false
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'appointment', label: 'Appointment' },
    { value: 'service', label: 'Service' },
    { value: 'payment', label: 'Payment' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' }
  ];

  useEffect(() => {
    fetchNotes();
  }, [customerId]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      // First fetch the notes
      const { data: notesData, error: notesError } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;

      // Then fetch staff information for each note
      const notesWithStaff: CustomerNote[] = [];
      
      for (const note of notesData || []) {
        let staff = null;
        
        if (note.staff_id) {
          const { data: staffData } = await supabase
            .from('staff')
            .select('first_name, last_name')
            .eq('id', note.staff_id)
            .single();
          
          staff = staffData;
        }
        
        notesWithStaff.push({
          ...note,
          staff
        });
      }

      setNotes(notesWithStaff);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load customer notes'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.note.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Note content is required'
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('customer_notes')
        .insert({
          customer_id: customerId,
          staff_id: user.user.id,
          note: newNote.note,
          category: newNote.category,
          tags: newNote.tags,
          is_important: newNote.is_important
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Note created successfully'
      });

      setNewNote({
        note: '',
        category: 'general',
        tags: [],
        is_important: false
      });
      setTagInput('');
      setShowCreateForm(false);
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create note'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !newNote.tags.includes(tag)) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Customer Notes</h3>
          <p className="text-sm text-muted-foreground">{customerName}</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes and tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <NoteFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      )}

      {/* Create Note Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newNote.category}
                  onValueChange={(value) => setNewNote(prev => ({ ...prev, category: value }))}
                >
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
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="important"
                    checked={newNote.is_important}
                    onChange={(e) => setNewNote(prev => ({ ...prev, is_important: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="important" className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Mark as Important
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note Content</Label>
              <Textarea
                placeholder="Enter note details..."
                value={newNote.note}
                onChange={(e) => setNewNote(prev => ({ ...prev, note: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {newNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newNote.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateNote} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Note'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No notes found</p>
            <p className="text-sm">Create the first note for this customer</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <CustomerNoteCard
              key={note.id}
              note={note}
              onUpdate={fetchNotes}
            />
          ))
        )}
      </div>
    </div>
  );
};
