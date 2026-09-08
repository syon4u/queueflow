import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Lock, MonitorDown, ShieldCheck } from 'lucide-react';

/** Four short, true platform facts. Rendered as a quiet band, not a feature grid. */
const FACTS = [
  { key: 'rls', icon: ShieldCheck },
  { key: 'encrypted', icon: Lock },
  { key: 'pwa', icon: MonitorDown },
  { key: 'languages', icon: Languages },
] as const;

const TrustStrip: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="landing-trust-title" className="border-y border-gray-200 bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 id="landing-trust-title" className="sr-only">
          {t('public.trust.title')}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-700" />
              <span>{t(`public.trust.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustStrip;
