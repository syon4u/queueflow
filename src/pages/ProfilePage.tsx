
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCog } from 'lucide-react';
import PageBreadcrumb from '@/components/navigation/PageBreadcrumb';
import ProfileForm from '@/components/profile/ProfileForm';
import AccountInfo from '@/components/profile/AccountInfo';

const ProfilePage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto p-6">
      <PageBreadcrumb 
        items={[
          { label: 'Profile', path: '/profile', icon: <UserCog className="h-4 w-4" /> }
        ]} 
      />
      
      <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <ProfileForm />
        </div>
        <div>
          <AccountInfo />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
