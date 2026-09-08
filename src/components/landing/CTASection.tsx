import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export const CONTACT_EMAIL = 'info@garrickinternational.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('QueueFlow')}`;

/**
 * Final buyer call to action on the ink ground. Also rendered at the foot of
 * the pricing page, so it carries the `landing` scope class itself.
 */
const CTASection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="landing-cta-title"
      className="landing on-ink relative isolate overflow-hidden bg-[--ink] py-20 text-white sm:py-28"
    >
      <div aria-hidden="true" className="qf-dot-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden="true"
        className="qf-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />
      <div className="mx-auto w-full max-w-6xl px-5 text-center sm:px-6">
        <h2
          id="landing-cta-title"
          className="reveal mx-auto max-w-[20ch] font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[40px]"
        >
          {t('public.cta.headline')}
        </h2>
        <p className="reveal mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-[--on-ink-2] sm:text-lg">
          {t('public.cta.subtitle')}
        </p>
        <div className="reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={CONTACT_MAILTO} className="qf-btn qf-btn-brand w-full sm:w-auto">
            <Mail aria-hidden="true" className="size-4" />
            {t('public.cta.talkToUs')}
          </a>
          <Link to="/customer" className="qf-btn qf-btn-outline-ink w-full sm:w-auto">
            {t('public.cta.tryDemo')}
          </Link>
        </div>
        <p className="reveal mt-7 text-[14px] text-[--on-ink-2]">
          <a
            href={CONTACT_MAILTO}
            className="inline-flex min-h-11 items-center rounded-md text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
};

export default CTASection;
