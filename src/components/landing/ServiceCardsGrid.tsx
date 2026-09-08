import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, LogIn, Search, Timer } from 'lucide-react';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';

/** Customer quick actions: the four things a visitor actually comes here to do. */
const ACTIONS = [
  { key: 'book', icon: CalendarDays, to: '/customer' },
  { key: 'checkIn', icon: LogIn, to: '/check-in' },
  { key: 'status', icon: Timer, to: '/status' },
  { key: 'find', icon: Search, to: '/appointment-lookup' },
] as const;

const LOBBY_LINKS = [
  { key: 'kiosk', to: '/kiosk' },
  { key: 'signage', to: '/digital-signage' },
  { key: 'virtualQueue', to: '/virtual-queue' },
] as const;

const ServiceCardsGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection tone="muted" labelledBy="landing-actions-title">
      <SectionHeading
        id="landing-actions-title"
        eyebrow={t('public.quickActions.eyebrow')}
        title={t('public.quickActions.title')}
        description={t('public.quickActions.subtitle')}
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map(({ key, icon: Icon, to }) => (
          <li key={key} className="flex">
            <Link
              to={to}
              className="group flex w-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold text-gray-900">{t(`public.quickActions.${key}.title`)}</span>
              <span className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-600">
                {t(`public.quickActions.${key}.description`)}
              </span>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                {t(`public.quickActions.${key}.action`)}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 flex flex-wrap items-center justify-center gap-x-2 text-sm text-gray-600">
        <span>{t('public.quickActions.lobbiesLabel')}</span>
        {LOBBY_LINKS.map(({ key, to }, index) => (
          <React.Fragment key={key}>
            {index > 0 && <span aria-hidden="true">·</span>}
            <Link
              to={to}
              className="inline-flex min-h-11 items-center rounded-sm px-1 font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {t(`public.quickActions.${key}`)}
            </Link>
          </React.Fragment>
        ))}
      </p>
    </LandingSection>
  );
};

export default ServiceCardsGrid;
