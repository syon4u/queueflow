import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView, useReducedMotion } from 'motion/react';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';
import { TicketNumber } from '@/components/landing/fx';

const STEPS = ['book', 'call', 'see'] as const;

/** Square ticket stub whose number rolls 00 → 0n as the step enters view. */
const StepStub: React.FC<{ number: number }> = ({ number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = useReducedMotion();
  return (
    <span ref={ref} aria-hidden="true" className="qf-stub-shadow relative z-10 flex shrink-0 md:mb-6">
      <span className="qf-stub qf-perf-top flex size-14 items-center justify-center rounded-xl pt-1">
        <TicketNumber value={reduced || inView ? number : 0} prefix="" digits={2} className="qf-stub-num text-[24px] text-[--stamp]" />
      </span>
    </span>
  );
};

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
        {/* Tear line between the stubs (desktop only) */}
        <div
          aria-hidden="true"
          className="qf-tear pointer-events-none absolute left-7 right-[calc(33.33%-56px)] top-7 hidden h-px md:block"
        />
        {STEPS.map((step, index) => (
          <li key={step} className="reveal relative flex gap-4 md:block">
            <StepStub number={index + 1} />
            <div>
              <h3 className="qf-h3 text-[--text-1]">
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
