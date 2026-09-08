import React from 'react';
import { useTranslation } from 'react-i18next';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';

const STEPS = ['book', 'call', 'see'] as const;

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection id="how-it-works" tone="paper" labelledBy="landing-how-title">
      <SectionHeading
        id="landing-how-title"
        eyebrow={t('public.howItWorks.eyebrow')}
        title={t('public.howItWorks.title')}
        description={t('public.howItWorks.subtitle')}
      />
      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
        {/* Connector between the numbered circles (desktop only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 right-[calc(33.33%-41px)] top-5 hidden h-px bg-[--hairline] md:block"
        />
        {STEPS.map((step, index) => (
          <li key={step} className="reveal relative flex gap-4 md:block">
            <span
              aria-hidden="true"
              className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-[--brand] font-display text-[15px] font-bold tabular-nums text-white shadow-[var(--shadow-card)] md:mb-6"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-[20px] font-bold leading-snug text-[--text-1]">
                <span className="sr-only">{t('public.howItWorks.stepLabel', { number: index + 1 })} </span>
                {t(`public.howItWorks.steps.${step}.title`)}
              </h3>
              <p className="mt-2.5 max-w-[42ch] text-[16px] leading-relaxed text-[--text-2]">
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
