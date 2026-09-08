
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Clock, MapPin, User, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ServiceCardsGrid = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Calendar,
      title: t('public.serviceCards.schedule.title'),
      description: t('public.serviceCards.schedule.description'),
      buttonText: t('public.serviceCards.schedule.button'),
      link: '/customer',
      gradient: 'from-blue-500 to-blue-600',
      featured: true
    },
    {
      icon: Search,
      title: t('public.serviceCards.find.title'),
      description: t('public.serviceCards.find.description'),
      buttonText: t('public.serviceCards.find.button'),
      link: '/appointment-lookup',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: t('public.serviceCards.checkIn.title'),
      description: t('public.serviceCards.checkIn.description'),
      buttonText: t('public.serviceCards.checkIn.button'),
      link: '/check-in',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      title: t('public.serviceCards.status.title'),
      description: t('public.serviceCards.status.description'),
      buttonText: t('public.serviceCards.status.button'),
      link: '/status',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: Smartphone,
      title: t('public.serviceCards.mobile.title'),
      description: t('public.serviceCards.mobile.description'),
      buttonText: t('public.serviceCards.mobile.button'),
      link: '/mobile-queue',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: User,
      title: t('public.serviceCards.kiosk.title'),
      description: t('public.serviceCards.kiosk.description'),
      buttonText: t('public.serviceCards.kiosk.button'),
      link: '/kiosk',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-gray-200"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('public.serviceCards.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('public.serviceCards.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 ${
                service.featured ? 'lg:col-span-1 lg:row-span-1' : ''
              }`}
            >
              <CardHeader className="text-center pb-4 relative overflow-hidden">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br ${service.gradient} w-fit group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                
                <CardTitle className="text-xl mb-3 group-hover:text-gray-900 transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Link to={service.link} className="block">
                  <Button 
                    className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg text-white border-0 group-hover:scale-105 transition-all duration-300`}
                    size="lg"
                  >
                    {service.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/virtual-queue">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-6 py-3">
                {t('public.serviceCards.virtualQueue')}
              </Button>
            </Link>
            <Link to="/digital-signage">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-6 py-3">
                {t('public.serviceCards.digitalSignage')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCardsGrid;
