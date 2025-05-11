
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <AlertTriangle size={64} className="text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-destructive">{t('unauthorized.title', 'Access Denied')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('unauthorized.description', "You don't have permission to access this page.")}
        </p>
        <Button className="w-full" asChild>
          <Link to="/">{t('unauthorized.backToHome', 'Return to Home')}</Link>
        </Button>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        <p>QUEUE FLOW v1.0.0-beta</p>
      </div>
    </div>
  );
};

export default Unauthorized;
