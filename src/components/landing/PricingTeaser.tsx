import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';

const TIERS = ['starter', 'growth', 'enterprise'] as const;

const PricingTeaser: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection id="pricing" tone="paper" labelledBy="landing-pricing-title">
      <SectionHeading
        id="landing-pricing-title"
        eyebrow={t('public.pricingTeaser.eyebrow')}
        title={t('public.pricingTeaser.title')}
        description={t('public.pricingTeaser.subtitle')}
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {TIERS.map((tier) => {
          const featured = tier === 'growth';
          return (
            <li
              key={tier}
              className={
                'reveal qf-card qf-card-hover relative flex flex-col p-6 sm:p-7 ' +
                (featured ? 'border-[--brand] shadow-[var(--shadow-card)]' : '')
              }
            >
              {featured && (
                <span className="absolute right-5 top-5 rounded-full bg-[--brand] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                  {t('public.pricing.mostPopular')}
                </span>
              )}
              <h3 className="text-[22px] font-bold leading-snug text-[--text-1]">{t(`public.pricing.${tier}.name`)}</h3>
              <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-[--text-2]">{t(`public.pricing.${tier}.tagline`)}</p>
            </li>
          );
        })}
      </ul>
      <div className="reveal mt-10 text-center">
        <Link to="/pricing" className="qf-btn qf-btn-brand">
          {t('public.pricingTeaser.link')}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </LandingSection>
  );
};

export default PricingTeaser;
