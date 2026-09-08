
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string | null;
}

interface KioskLocationSelectorProps {
  locations: Location[];
  onLocationSelect: (locationId: string) => void;
}

export const KioskLocationSelector: React.FC<KioskLocationSelectorProps> = ({
  locations,
  onLocationSelect,
}) => {
  const { t } = useTranslation();
  if (!locations.length) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-2xl p-12 text-center border-2 border-orange-200">
        <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Clock className="h-14 w-14 text-white" />
        </div>
        <h3 className="text-4xl font-bold text-gray-800 mb-6">
          {t('public.kiosk.location.noneTitle')}
        </h3>
        <p className="text-2xl text-gray-600 max-w-md mx-auto">
          {t('public.kiosk.location.noneDescription')}
        </p>
      </div>
    );
  }

  const tileColors = [
    'from-blue-500 to-blue-700',
    'from-emerald-500 to-emerald-700',
    'from-purple-500 to-purple-700',
    'from-pink-500 to-pink-700',
    'from-indigo-500 to-indigo-700',
    'from-teal-500 to-teal-700',
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-blue-100">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <MapPin className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-5xl font-bold text-gray-900 mb-4">
          {t('public.kiosk.location.title')}
        </h3>
        <p className="text-2xl text-gray-600">
          {t('public.kiosk.location.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {locations.map((location, index) => (
          <div
            key={location.id}
            className={`relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br ${tileColors[index % tileColors.length]}`}
            role="button"
            tabIndex={0}
            onClick={() => onLocationSelect(location.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onLocationSelect(location.id);
              }
            }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <ChevronRight className="h-8 w-8 text-white/80" />
              </div>
              
              <h4 className="text-2xl font-bold mb-3 leading-tight">
                {location.name}
              </h4>
              
              {location.address && (
                <p className="text-lg text-white/90 leading-relaxed">
                  {location.address}
                </p>
              )}
              
              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium">{t('public.kiosk.location.select')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
