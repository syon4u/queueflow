
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Shield, BarChart3, Calendar, Bell, MapPin, Smartphone } from 'lucide-react';

const FeaturesShowcase: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Clock,
      title: t('public.features.realtime.title'),
      description: t('public.features.realtime.description'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: t('public.features.scheduling.title'),
      description: t('public.features.scheduling.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: t('public.features.queue.title'),
      description: t('public.features.queue.description'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Bell,
      title: t('public.features.notifications.title'),
      description: t('public.features.notifications.description'),
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: t('public.features.secure.title'),
      description: t('public.features.secure.description'),
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: BarChart3,
      title: t('public.features.analytics.title'),
      description: t('public.features.analytics.description'),
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: MapPin,
      title: t('public.features.multiLocation.title'),
      description: t('public.features.multiLocation.description'),
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: t('public.features.mobileFirst.title'),
      description: t('public.features.mobileFirst.description'),
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('public.features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('public.features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6 text-center">
                {/* Icon with Gradient Background */}
                <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('public.features.highlightTitle')}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {t('public.features.highlightDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {t('public.features.badgeCloud')}
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                {t('public.features.badgeRls')}
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                {t('public.features.badgeEncrypted')}
              </div>
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                {t('public.features.badgePwa')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
