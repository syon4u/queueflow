import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, GraduationCap, Landmark, Stethoscope, Store, Wrench } from 'lucide-react';
import { Marquee } from '@/components/landing/fx';

/** Kinds of front desk QueueFlow is built for. Not customers — no logos, no names. */
const FITS = [
  { key: 'clinics', icon: Stethoscope },
  { key: 'government', icon: Landmark },
  { key: 'banks', icon: Building2 },
  { key: 'serviceCentres', icon: Store },
  { key: 'campuses', icon: GraduationCap },
  { key: 'repairShops', icon: Wrench },
] as const;

/**
 * Departures-board strip: the six sectors travel across the cream ground as
 * ticket stubs, separated by a stamp-coloured dot. The strip has a fixed
 * height (chips are 44 px, padding 8 px) so it never shifts layout; under
 * prefers-reduced-motion it becomes a static wrapping row (fx.css).
 */
const FitStrip: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="landing-fit-title" className="border-b border-[--hairline] bg-[--cream] py-10 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <h2 id="landing-fit-title" className="qf-eyebrow reveal text-center">
          {t('public.fit.eyebrow')}
        </h2>
      </div>
      <Marquee
        role="group"
        aria-label={t('public.fit.marqueeLabel')}
        pauseOnHover
        repeat={4}
        className="mt-6 [--duration:38s] [--gap:0.75rem]"
      >
        <ul className="qf-marquee-row flex shrink-0 items-center gap-[var(--gap)]">
          {FITS.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-center gap-[var(--gap)]">
              <span className="qf-stub-paper qf-perf-top qf-signage inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-lg px-4 pt-0.5 text-[15px] font-semibold text-[--text-1]">
                <Icon aria-hidden="true" className="size-4 text-[--stamp]" />
                {t(`public.fit.${key}`)}
              </span>
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[--stamp]" />
            </li>
          ))}
        </ul>
      </Marquee>
    </section>
  );
};

export default FitStrip;
