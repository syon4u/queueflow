import React from 'react';
import { useTranslation } from 'react-i18next';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';

const STEPS = ['book', 'call', 'see'] as const;

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection tone="white" labelledBy="landing-how-title">
      <SectionHeading
        id="landing-how-title"
        eyebrow={t('public.howItWorks.eyebrow')}
        title={t('public.howItWorks.title')}
        description={t('public.howItWorks.subtitle')}
      />
      <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
        {STEPS.map((step, index) => (
          <li key={step} className="relative flex gap-4 md:block">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-700 text-base font-bold tabular-nums text-white md:mb-5"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-sans text-lg font-semibold leading-snug tracking-normal text-gray-900">
                <span className="sr-only">{t('public.howItWorks.stepLabel', { number: index + 1 })} </span>
                {t(`public.howItWorks.steps.${step}.title`)}
              </h3>
              <p className="mt-2 max-w-[45ch] leading-relaxed text-gray-600">
                {t(`public.howItWorks.steps.${step}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
};

export default HowItWorksSection;
