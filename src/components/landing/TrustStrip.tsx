import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Lock, MonitorDown, ShieldCheck } from 'lucide-react';

/** Four short, true platform facts in one perforated ticket row. */
const FACTS = [
  { key: 'rls', icon: ShieldCheck },
  { key: 'encrypted', icon: Lock },
  { key: 'pwa', icon: MonitorDown },
  { key: 'languages', icon: Languages },
] as const;

const TrustStrip: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="landing-trust-title" className="bg-[--paper] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <h2 id="landing-trust-title" className="sr-only">
          {t('public.trust.title')}
        </h2>
        <ul className="qf-stub qf-perf-y grid rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map(({ key, icon: Icon }, i) => (
            <li
              key={key}
              className="reveal flex flex-col gap-3 border-[--hairline] px-5 pb-6 pt-7 text-[15px] font-medium text-[--text-1] [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0"
            >
              <span aria-hidden="true" className="qf-eyebrow flex items-center gap-3">
                0{i + 1}
                <span className="h-px flex-1 bg-[--hairline]" />
              </span>
              <span className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[--stamp] shadow-[var(--shadow-card)]">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <span className="text-balance">{t(`public.trust.${key}`)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustStrip;
