
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from './DataTable';

interface Location {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  max_capacity: number | null;
  current_capacity: number | null;
  capacity_buffer: number | null;
}

interface LocationFormData {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  max_capacity: string;
  capacity_buffer: string;
}

export const LocationsTab: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    max_capacity: '50',
    capacity_buffer: '5'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch locations
  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const { error } = await supabase
        .from('locations')
        .insert([{ 
          name: data.name,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          max_capacity: parseInt(data.max_capacity),
          capacity_buffer: parseInt(data.capacity_buffer)
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Close first so a second click cannot resubmit while the list refetches (F36).
      closeDialog();
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({ title: "Success", description: "Location created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to create location: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const { error } = await supabase
        .from('locations')
        .update({ 
          name: data.name,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          max_capacity: parseInt(data.max_capacity),
          capacity_buffer: parseInt(data.capacity_buffer)
        })
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Close first so a second click cannot resubmit while the list refetches (F36).
      closeDialog();
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({ title: "Success", description: "Location updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to update location: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({ title: "Success", description: "Location deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to delete location: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  const columns: Column<Location>[] = [
    { key: 'name', header: 'Name' },
    { key: 'address', header: 'Address' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { 
      key: 'capacity_status', 
      header: 'Capacity Status'
    }
  ];

  const formatLocationData = (locations: Location[]) => {
    return locations.map(location => ({
      ...location,
      capacity_status: (
        <div className="space-y-1">
          <div className="text-sm">
            Current: {location.current_capacity || 0}/{location.max_capacity || 50}
          </div>
          <Badge variant={
            (location.current_capacity || 0) >= ((location.max_capacity || 50) - (location.capacity_buffer || 5))
              ? 'destructive' 
              : 'secondary'
          }>
            {(location.current_capacity || 0) >= ((location.max_capacity || 50) - (location.capacity_buffer || 5))
              ? 'At Capacity' 
              : 'Available'
            }
          </Badge>
        </div>
      )
    }));
  };

  const handleAddClick = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      max_capacity: '50',
      capacity_buffer: '5'
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditClick = (location: Location) => {
    setFormData({
      id: location.id,
      name: location.name,
      address: location.address || '',
      phone: location.phone || '',
      email: location.email || '',
      max_capacity: (location.max_capacity || 50).toString(),
      capacity_buffer: (location.capacity_buffer || 5).toString()
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (location: Location) => {
    if (deleteMutation.isPending) return;
    if (window.confirm(`Are you sure you want to delete ${location.name}?`)) {
      deleteMutation.mutate(location.id);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Locations</h1>
      
      <DataTable
        data={formatLocationData(locations || [])}
        columns={columns}
        isLoading={isLoading}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* Location Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="max_capacity">Max Capacity</Label>
                  <Input
                    id="max_capacity"
                    name="max_capacity"
                    type="number"
                    value={formData.max_capacity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="capacity_buffer">Capacity Buffer</Label>
                  <Input
                    id="capacity_buffer"
                    name="capacity_buffer"
                    type="number"
                    value={formData.capacity_buffer}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
