
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check } from 'lucide-react';
import { getVersionString } from '@/version';

const Unauthorized = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <Check size={64} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-green-600">{t('unauthorized.accessGranted', 'Access Granted')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('unauthorized.fullAccess', "You now have full access to all pages in the application.")}
        </p>
        <div className="space-y-4">
          <Button className="w-full" asChild>
            <Link to="/">{t('unauthorized.backToHome', 'Return to Home')}</Link>
          </Button>
          <Button className="w-full" variant="outline" asChild>
            <Link to="/admin">{t('unauthorized.goToAdmin', 'Go to Admin Panel')}</Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        <p>QUEUE FLOW {getVersionString()}</p>
      </div>
    </div>
  );
};

export default Unauthorized;
