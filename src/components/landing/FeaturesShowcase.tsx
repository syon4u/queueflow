import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, KeyRound, LayoutDashboard, Smartphone, Store, Timer } from 'lucide-react';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';

/** Six real capabilities, one accent. Descriptions describe shipped behaviour only. */
const CAPABILITIES = [
  { key: 'kiosk', icon: Store },
  { key: 'checkIn', icon: KeyRound },
  { key: 'live', icon: Timer },
  { key: 'virtual', icon: Smartphone },
  { key: 'staff', icon: LayoutDashboard },
  { key: 'analytics', icon: BarChart3 },
] as const;

const FeaturesShowcase: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection tone="white" labelledBy="landing-capabilities-title">
      <SectionHeading
        id="landing-capabilities-title"
        eyebrow={t('public.capabilities.eyebrow')}
        title={t('public.capabilities.title')}
        description={t('public.capabilities.subtitle')}
      />
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map(({ key, icon: Icon }) => (
          <li key={key} className="flex gap-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-sans text-lg font-semibold leading-snug tracking-normal text-gray-900">{t(`public.capabilities.items.${key}.title`)}</h3>
              <p className="mt-1.5 max-w-[45ch] text-sm leading-relaxed text-gray-600 sm:text-base">
                {t(`public.capabilities.items.${key}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
};

export default FeaturesShowcase;
