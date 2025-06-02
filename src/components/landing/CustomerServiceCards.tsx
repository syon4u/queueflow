
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, Shield } from 'lucide-react';

const CustomerServiceCards: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.services.title')}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('landing.services.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card 
          className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          onClick={() => handleCardClick('/customer')}
        >
          <CardContent className="p-6">
            <div className="bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('landing.services.schedule.title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('landing.services.schedule.description')}
            </p>
            <div className="text-green-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              {t('landing.services.schedule.action')} <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          onClick={() => handleCardClick('/customer')}
        >
          <CardContent className="p-6">
            <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('landing.services.queue.title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('landing.services.queue.description')}
            </p>
            <div className="text-blue-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              {t('landing.services.queue.action')} <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerServiceCards;
