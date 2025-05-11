
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { getVersionString } from '@/version';
import { useAuth } from '@/context/AuthContext';

const Unauthorized = () => {
  const { t } = useTranslation();
  const { role } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <AlertTriangle size={64} className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold text-amber-600">{t('unauthorized.title', 'Unauthorized Access')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('unauthorized.description', "You don't have permission to access this page. Your current role is:")} <span className="font-semibold">{role || 'customer'}</span>
        </p>
        <div className="space-y-4">
          <Button className="w-full" asChild>
            <Link to="/">{t('unauthorized.backToHome', 'Return to Home')}</Link>
          </Button>
          
          {role === 'customer' && (
            <Button className="w-full" variant="outline" asChild>
              <Link to="/customer">{t('unauthorized.customerDashboard', 'Go to Customer Dashboard')}</Link>
            </Button>
          )}
          
          {role === 'staff' && (
            <Button className="w-full" variant="outline" asChild>
              <Link to="/staff">{t('unauthorized.staffDashboard', 'Go to Staff Dashboard')}</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        <p>QUEUE FLOW {getVersionString()}</p>
      </div>
    </div>
  );
};

export default Unauthorized;
