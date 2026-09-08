
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Clock, MapPin, User, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CustomerServiceCards = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Calendar,
      title: 'Schedule Appointment',
      description: 'Book your visit in advance and skip the wait',
      buttonText: 'Schedule Now',
      link: '/customer',
      variant: 'default' as const
    },
    {
      icon: Search,
      title: 'Find My Appointment',
      description: 'Look up, modify, or cancel your existing appointment',
      buttonText: 'Find Appointment',
      link: '/appointment-lookup',
      variant: 'outline' as const
    },
    {
      icon: Clock,
      title: "I'm Here",
      description: 'Check in for your appointment when you arrive',
      buttonText: 'Check In',
      link: '/check-in',
      variant: 'outline' as const
    },
    {
      icon: MapPin,
      title: 'Queue Status',
      description: 'View current wait times and queue status',
      buttonText: 'View Status',
      link: '/status',
      variant: 'outline' as const
    },
    {
      icon: Smartphone,
      title: 'Mobile Queue',
      description: 'Join the virtual queue from your mobile device',
      buttonText: 'Join Queue',
      link: '/mobile-queue',
      variant: 'outline' as const
    },
    {
      icon: User,
      title: 'Walk-In Kiosk',
      description: 'Use our self-service kiosk for walk-in visits',
      buttonText: 'Use Kiosk',
      link: '/kiosk',
      variant: 'outline' as const
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('landing.servicesTitle', 'How Can We Help You Today?')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('landing.servicesSubtitle', 'Choose the option that works best for you')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 w-fit">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={service.link} className="block">
                  <Button 
                    variant={service.variant} 
                    className="w-full"
                    size="lg"
                  >
                    {service.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Quick Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/virtual-queue">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                Virtual Queue →
              </Button>
            </Link>
            <Link to="/digital-signage">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                Digital Signage →
              </Button>
            </Link>
            <Link to="/design-system">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                Design System →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceCards;
