import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Languages, ListOrdered, Smartphone } from 'lucide-react';
import ProductPreview from '@/components/landing/ProductPreview';

/** Three true product facts shown under the hero buttons. */
const FACTS = [
  { key: 'oneLine', icon: ListOrdered },
  { key: 'livePosition', icon: Smartphone },
  { key: 'languages', icon: Languages },
] as const;

/**
 * Landing hero on the ink ground: copy and calls to action on the left, the
 * product itself (staff dashboard + customer ticket) on the right.
 */
const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="landing-hero-title"
      className="on-ink relative isolate overflow-hidden bg-[--ink] text-white"
    >
      <div aria-hidden="true" className="qf-dot-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden="true"
        className="qf-glow pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full lg:left-[58%] lg:top-[-140px] lg:h-[680px] lg:w-[680px] lg:translate-x-0"
      />

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="qf-eyebrow reveal">{t('public.hero.eyebrow')}</p>
            <h1
              id="landing-hero-title"
              className="reveal mt-5 max-w-[20ch] font-display text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[48px] lg:text-[56px]"
            >
              {t('public.hero.headline')}
            </h1>
            <p className="reveal mt-6 max-w-[58ch] text-[17px] leading-[1.6] text-[--on-ink-2] sm:text-lg">
              {t('public.hero.subline')}
            </p>

            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/pricing" className="qf-btn qf-btn-brand">
                {t('public.hero.seePricing')}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link to="/customer" className="qf-btn qf-btn-outline-ink">
                {t('public.hero.tryDemo')}
              </Link>
            </div>

            <ul className="reveal mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[14px] text-[--on-ink-2] sm:flex-row sm:flex-wrap sm:gap-x-8">
              {FACTS.map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-center gap-2.5">
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-[--sky]" />
                  <span>{t(`public.hero.facts.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal lg:col-span-5">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
