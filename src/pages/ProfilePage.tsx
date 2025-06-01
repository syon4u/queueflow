import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardCard from '@/components/ui/broward-card';
import BrowardInput from '@/components/ui/broward-input';
import BrowardButton from '@/components/ui/broward-button';

const ProfilePage = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: 'Demo',
    lastName: 'User',
    email: user?.email || '',
    phone: '555-123-4567'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('profile.success'),
        description: t('profile.profileUpdated')
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: t('profile.errorUpdating'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <BrowardLayout headerTitle="User Profile">
      <BrowardHero 
        title="Your Profile" 
        subtitle="Manage your personal information and account settings"
        backgroundStyle="pattern"
      />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <BrowardCard title="Personal Information" elevation="md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BrowardInput
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('profile.firstNamePlaceholder')}
                  />
                  
                  <BrowardInput
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t('profile.lastNamePlaceholder')}
                  />
                </div>
                
                <BrowardInput
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('profile.emailPlaceholder')}
                />
                
                <BrowardInput
                  label="Phone"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('profile.phonePlaceholder')}
                />
                
                <div className="pt-2">
                  <BrowardButton type="submit" disabled={isLoading}>
                    {isLoading ? t('common.saving') : t('common.save')}
                  </BrowardButton>
                </div>
              </form>
            </BrowardCard>
          </div>
          
          <div>
            <BrowardCard title="Account Information" elevation="md">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t('profile.userRole')}</p>
                  <p className="font-medium capitalize text-bc-navy dark:text-bc-blue">{role}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t('profile.userId')}</p>
                  <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">{user?.id}</p>
                </div>
                
                <div className="pt-4 space-y-2">
                  <BrowardButton asChild variant="outline" className="w-full">
                    <Link to="/">{t('common.backToHome')}</Link>
                  </BrowardButton>
                  
                  {role === 'customer' && (
                    <BrowardButton asChild className="w-full">
                      <Link to="/customer">{t('common.customerDashboard')}</Link>
                    </BrowardButton>
                  )}
                  
                  {(role === 'staff' || role === 'admin') && (
                    <BrowardButton asChild className="w-full">
                      <Link to="/staff">{t('common.staffDashboard')}</Link>
                    </BrowardButton>
                  )}
                  
                  {role === 'admin' && (
                    <BrowardButton asChild className="w-full">
                      <Link to="/admin">{t('admin.dashboard')}</Link>
                    </BrowardButton>
                  )}
                </div>
              </div>
            </BrowardCard>
          </div>
        </div>
      </div>
    </BrowardLayout>
  );
};

export default ProfilePage;