
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CheckInCard from '@/components/customer/CheckInCard';

const CheckInPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('public.checkIn.pageTitle')}</h1>
        </div>

        {/* Check-in Form */}
        <CheckInCard />

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>{t('public.checkIn.helpLine1')}</p>
          <p>{t('public.checkIn.helpLine2')}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
