import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';

const TIERS = ['starter', 'growth', 'enterprise'] as const;

const PricingTeaser: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection tone="muted" labelledBy="landing-pricing-title">
      <SectionHeading
        id="landing-pricing-title"
        eyebrow={t('public.pricingTeaser.eyebrow')}
        title={t('public.pricingTeaser.title')}
        description={t('public.pricingTeaser.subtitle')}
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <li
            key={tier}
            className={
              tier === 'growth'
                ? 'rounded-xl border-2 border-blue-700 bg-white p-6'
                : 'rounded-xl border border-gray-200 bg-white p-6'
            }
          >
            <h3 className="font-sans text-xl font-bold leading-snug tracking-normal text-gray-900">{t(`public.pricing.${tier}.name`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{t(`public.pricing.${tier}.tagline`)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <Button asChild size="lg" className="h-12 bg-blue-700 px-6 text-base font-semibold text-white hover:bg-blue-800">
          <Link to="/pricing">
            {t('public.pricingTeaser.link')}
            <ArrowRight aria-hidden="true" className="ml-1 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </LandingSection>
  );
};

export default PricingTeaser;
