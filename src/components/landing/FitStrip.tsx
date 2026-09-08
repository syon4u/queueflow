import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, GraduationCap, Landmark, Stethoscope, Store, Wrench } from 'lucide-react';

/** Kinds of front desk QueueFlow is built for. Not customers — no logos, no names. */
const FITS = [
  { key: 'clinics', icon: Stethoscope },
  { key: 'government', icon: Landmark },
  { key: 'banks', icon: Building2 },
  { key: 'serviceCentres', icon: Store },
  { key: 'campuses', icon: GraduationCap },
  { key: 'repairShops', icon: Wrench },
] as const;

const FitStrip: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="landing-fit-title" className="border-b border-[--hairline] bg-[--mist] py-10 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <h2 id="landing-fit-title" className="qf-eyebrow reveal text-center">
          {t('public.fit.eyebrow')}
        </h2>
        <ul className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {FITS.map(({ key, icon: Icon }) => (
            <li
              key={key}
              className="reveal inline-flex min-h-11 items-center gap-2 rounded-full border border-[--hairline] bg-white px-4 text-[14px] font-medium text-[--text-1]"
            >
              <Icon aria-hidden="true" className="size-4 text-[--brand]" />
              {t(`public.fit.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FitStrip;
