
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { UnifiedProfileEditor } from '@/components/profile/UnifiedProfileEditor';
import { Loader2, User } from 'lucide-react';

const ProfilePage = () => {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pattern-grid bg-gradient-overlay-teal">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-pattern-grid bg-gradient-overlay-teal">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 mb-4">Failed to load profile</p>
                <Button asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern-grid bg-gradient-overlay-teal">
      <div className="container mx-auto p-6">
        <div className="bg-image bg-image-overlay rounded-xl mb-6" 
             style={{ backgroundImage: "url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg')" }}>
          <div className="p-6">
            <h1 className="text-3xl font-bold">User Profile</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <UnifiedProfileEditor profile={profile} />
          </div>
          
          <Card className="bg-white/90 backdrop-filter backdrop-blur-sm border border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="font-mono text-xs break-all">{profile.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{profile.status}</p>
              </div>

              {profile.last_sign_in_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
                  <p className="text-sm">
                    {new Date(profile.last_sign_in_at).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div className="pt-4 space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Back to Home</Link>
                </Button>
                
                {profile.role === 'customer' && (
                  <Button asChild className="w-full">
                    <Link to="/customer">Customer Dashboard</Link>
                  </Button>
                )}
                
                {(profile.role === 'staff' || profile.role === 'admin') && (
                  <Button asChild className="w-full">
                    <Link to="/staff">Staff Dashboard</Link>
                  </Button>
                )}
                
                {profile.role === 'power_user' && (
                  <Button asChild className="w-full">
                    <Link to="/power-user">Power User Dashboard</Link>
                  </Button>
                )}
                
                {profile.role === 'admin' && (
                  <Button asChild className="w-full">
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
