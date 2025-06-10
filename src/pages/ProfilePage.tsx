
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';

const ProfilePage = () => {
  const { user, role } = useAuth();

  if (!user) {
    return (
      <PageLayout 
        headerTitle="Profile"
        headerSubtitle="Manage your account settings"
      >
        <div className="container mx-auto px-4 py-6">
          <p>Please sign in to view your profile.</p>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (userRole: string | null) => {
    switch (userRole) {
      case 'admin': return 'destructive';
      case 'power_user': return 'default';
      case 'staff': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <PageLayout 
      headerTitle="Profile"
      headerSubtitle="Manage your account settings and security"
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
        <EmailVerificationBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and role information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.email_confirmed_at ? (
                    <Badge variant="secondary" className="mt-1">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1">Unverified</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <Badge variant={getRoleBadgeVariant(role)} className="mt-1">
                    {role || 'customer'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Sign In</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.last_sign_in_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <ChangePasswordForm />
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
