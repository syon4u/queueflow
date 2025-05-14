
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const AccountInfo = () => {
  const { user, role } = useAuth();
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.accountInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('profile.userRole')}</p>
          <p className="font-medium capitalize">{role}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('profile.userId')}</p>
          <p className="font-mono text-xs">{user?.id}</p>
        </div>
        
        <div className="pt-4 space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">{t('common.backToHome')}</Link>
          </Button>
          
          {role === 'customer' && (
            <Button asChild className="w-full">
              <Link to="/customer">{t('common.customerDashboard')}</Link>
            </Button>
          )}
          
          {(role === 'staff' || role === 'admin') && (
            <Button asChild className="w-full">
              <Link to="/staff">{t('common.staffDashboard')}</Link>
            </Button>
          )}
          
          {role === 'admin' && (
            <Button asChild className="w-full">
              <Link to="/admin">{t('admin.dashboard')}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfo;
