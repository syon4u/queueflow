import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CONTACT_EMAIL = 'info@garrickinternational.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('QueueFlow')}`;

/** Final buyer call to action. Also rendered at the foot of the pricing page. */
const CTASection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="landing-cta-title" className="bg-blue-700 py-16 text-white sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
        <h2 id="landing-cta-title" className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t('public.cta.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-[60ch] text-lg leading-relaxed text-blue-100">{t('public.cta.subtitle')}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 w-full bg-white px-6 text-base font-semibold text-blue-800 hover:bg-blue-50 hover:text-blue-900 focus-visible:ring-white focus-visible:ring-offset-blue-700 sm:w-auto"
          >
            <a href={CONTACT_MAILTO}>
              <Mail aria-hidden="true" className="mr-1 h-5 w-5" />
              {t('public.cta.talkToUs')}
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-full border-white/60 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10 hover:text-white focus-visible:ring-white focus-visible:ring-offset-blue-700 sm:w-auto"
          >
            <Link to="/customer">{t('public.cta.tryDemo')}</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-blue-100">
          <a
            href={CONTACT_MAILTO}
            className="inline-flex min-h-11 items-center rounded-sm underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
};

export default CTASection;
