import React from 'react';
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

const PLANS: Plan[] = [
  {
    name: 'Starter',
    tagline: 'Single location, walk-in and appointment queueing',
    price: '$99',
    cadence: '/ month',
    features: [
      'Up to 2 staff seats',
      'Virtual queue + QR check-in',
      'Customer status page & PWA',
      'CSAT survey after each visit',
      'Email support',
    ],
    cta: 'Talk to sales',
  },
  {
    name: 'Growth',
    tagline: 'Multi-location teams that need real analytics and control',
    price: '$299',
    cadence: '/ month',
    highlighted: true,
    features: [
      'Up to 15 staff seats, multiple locations',
      'Everything in Starter',
      'Staff dashboard with RBAC (clerk/manager/admin)',
      'Advanced analytics & AI-assisted scheduling (in progress)',
      'Digital signage & kiosk mode',
      'Language switcher: Spanish, Portuguese, Haitian Creole (partial coverage today)',
      'Priority email + chat support',
    ],
    cta: 'Talk to sales',
  },
  {
    name: 'Enterprise',
    tagline: 'Large or regulated organizations with custom requirements',
    price: 'Custom',
    cadence: 'contact us',
    features: [
      'Unlimited staff seats & locations',
      'Everything in Growth',
      'SSO / SAML (roadmap) & custom RBAC policies',
      'SLA-backed support & onboarding',
      'Custom integrations (CRM/POS/signage)',
      'Dedicated success manager',
    ],
    cta: 'Contact Sales',
  },
];

/**
 * Static pricing page for demo / sale purposes. No billing integration —
 * a clean, on-brand plan comparison that gives a prospective buyer a sense
 * of packaging and go-to-market, consistent with the shadcn/ui design system
 * used across the rest of the app.
 */
const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation showStaffAccess={false} onToggleStaffAccess={() => {}} />

      <div className="w-full">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Simple, transparent pricing</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Plans that grow with your queue
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Whether you're running one front desk or a network of locations, QueueFlow scales with you.
              No setup fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col ${
                  plan.highlighted ? 'border-blue-600 border-2 shadow-xl relative' : 'shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-600">
                    Most Popular
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
                    href={`mailto:sales@queueflow.app?subject=${encodeURIComponent(`QueueFlow ${plan.name} plan`)}`}
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
            Billed monthly. Volume and public-sector pricing available on request.
          </p>
        </div>
      </div>

      <CTASection />
    </div>
  );
};

export default PricingPage;
