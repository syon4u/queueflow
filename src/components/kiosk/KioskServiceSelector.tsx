
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText, ChevronRight, Zap } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
}

interface KioskServiceSelectorProps {
  services: Service[];
  onServiceSelect: (serviceId: string) => void;
  onBack: () => void;
}

export const KioskServiceSelector: React.FC<KioskServiceSelectorProps> = ({
  services,
  onServiceSelect,
  onBack,
}) => {
  const { t } = useTranslation();
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return t('public.kiosk.service.durationMinutes', { minutes });
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return t('public.kiosk.service.durationHours', { hours });
    }
    return t('public.kiosk.service.durationHoursMinutes', { hours, minutes: remainingMinutes });
  };

  const serviceColors = [
    'from-violet-500 to-violet-700',
    'from-cyan-500 to-cyan-700',
    'from-rose-500 to-rose-700',
    'from-amber-500 to-amber-700',
    'from-lime-500 to-lime-700',
    'from-fuchsia-500 to-fuchsia-700',
  ];

  const serviceIcons = [FileText, Zap, Clock, FileText, Zap, Clock];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-blue-100">
      <div className="flex items-center gap-8 mb-12">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex items-center gap-3 px-8 py-4 text-xl border-3 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 rounded-2xl shadow-lg"
        >
          <ArrowLeft className="h-6 w-6" />
          {t('public.kiosk.service.back')}
        </Button>
        <div>
          <h3 className="text-5xl font-bold text-gray-900 mb-3">
            {t('public.kiosk.service.title')}
          </h3>
          <p className="text-2xl text-gray-600">
            {t('public.kiosk.service.subtitle')}
          </p>
        </div>
      </div>
      
      {!services.length ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <FileText className="h-16 w-16 text-white" />
          </div>
          <h4 className="text-4xl font-bold text-gray-600 mb-6">
            {t('public.kiosk.service.noneTitle')}
          </h4>
          <p className="text-2xl text-gray-500 max-w-md mx-auto">
            {t('public.kiosk.service.noneDescription')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const ServiceIcon = serviceIcons[index % serviceIcons.length];
            return (
              <div
                key={service.id}
                className={`relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br ${serviceColors[index % serviceColors.length]}`}
                onClick={() => onServiceSelect(service.id)}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative p-8 text-white min-h-[280px] flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <ServiceIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Clock className="h-5 w-5 text-white" />
                      <span className="text-lg font-bold">
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-4 leading-tight flex-shrink-0">
                    {service.name}
                  </h4>
                  
                  {service.description && (
                    <p className="text-lg text-white/90 leading-relaxed mb-6 flex-grow">
                      {service.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <span className="text-sm font-medium">{t('public.kiosk.service.select')}</span>
                    </div>
                    <ChevronRight className="h-6 w-6 text-white/80" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
