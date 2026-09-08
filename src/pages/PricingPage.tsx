import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navigation from '@/components/landing/Navigation';
import CTASection from '@/components/landing/CTASection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

type Plan = {
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  highlighted?: boolean;
  features: string[];
  cta: string;
};

/**
 * Static pricing page for demo / sale purposes. No billing integration —
 * a clean, on-brand plan comparison that gives a prospective buyer a sense
 * of packaging and go-to-market, consistent with the shadcn/ui design system
 * used across the rest of the app.
 */
const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const featureList = (plan: string) => t(`public.pricing.${plan}.features`, { returnObjects: true }) as string[];
  const plans: Plan[] = [
    {
      name: t('public.pricing.starter.name'),
      tagline: t('public.pricing.starter.tagline'),
      price: '$99',
      cadence: t('public.pricing.perMonth'),
      features: featureList('starter'),
      cta: t('public.pricing.talkToSales'),
    },
    {
      name: t('public.pricing.growth.name'),
      tagline: t('public.pricing.growth.tagline'),
      price: '$299',
      cadence: t('public.pricing.perMonth'),
      highlighted: true,
      features: featureList('growth'),
      cta: t('public.pricing.talkToSales'),
    },
    {
      name: t('public.pricing.enterprise.name'),
      tagline: t('public.pricing.enterprise.tagline'),
      price: t('public.pricing.custom'),
      cadence: t('public.pricing.contactUs'),
      features: featureList('enterprise'),
      cta: t('public.pricing.contactSales'),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation showStaffAccess={false} onToggleStaffAccess={() => {}} />

      <div className="w-full">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">{t('public.pricing.badge')}</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {t('public.pricing.title')}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {t('public.pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col ${
                  plan.highlighted ? 'border-blue-600 border-2 shadow-xl relative' : 'shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-600">
                    {t('public.pricing.mostPopular')}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.tagline}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.cadence}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a
                    href={`mailto:info@garrickinternational.com?subject=${encodeURIComponent(`QueueFlow ${plan.name} plan`)}`}
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${plan.highlighted ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-12">
            {t('public.pricing.footnote')}
          </p>
        </div>
      </div>

      <CTASection />
    </div>
  );
};

export default PricingPage;
