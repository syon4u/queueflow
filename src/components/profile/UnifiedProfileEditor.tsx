
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfile, UserProfile } from '@/hooks/useProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UnifiedProfileEditorProps {
  profile: UserProfile;
}

export const UnifiedProfileEditor: React.FC<UnifiedProfileEditorProps> = ({ profile }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    phone: profile.phone || '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Email (Read Only)</Label>
            <Input
              value={profile.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              Email can only be changed through account settings
            </p>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={profile.role}
              disabled
              className="bg-gray-50"
            />
          </div>

          <Button 
            type="submit" 
            disabled={updateProfileMutation.isPending}
            className="w-full"
          >
            {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
