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

/**
 * The customer block, on the lobby wall (ink + grain) so it reads as a
 * different audience from the buyer sections around it. Cards are paper
 * tickets with a torn top edge; the link box stays unmasked so the focus
 * ring is never clipped.
 */
const ServiceCardsGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection id="visitors" tone="ink" grain={0.06} labelledBy="landing-actions-title">
      <SectionHeading
        id="landing-actions-title"
        eyebrow={t('public.quickActions.eyebrow')}
        title={t('public.quickActions.title')}
        description={t('public.quickActions.subtitle')}
        onInk
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map(({ key, icon: Icon, to }) => (
          <li key={key} className="reveal flex">
            <Link to={to} className="qf-card-hover group flex w-full rounded-2xl hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,.6)]">
              <span className="qf-stub-paper qf-perf-top flex w-full flex-col rounded-2xl p-6 pt-7">
                <span className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-[--brand] text-white shadow-[var(--shadow-card)]">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="qf-h3 text-[19px] text-[--text-1]">{t(`public.quickActions.${key}.title`)}</span>
                <span className="mt-1.5 flex-1 text-[15px] leading-relaxed text-[--text-2]">
                  {t(`public.quickActions.${key}.description`)}
                </span>
                <span className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-[--brand-deep]">
                  {t(`public.quickActions.${key}.action`)}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="reveal mt-8 flex flex-wrap items-center justify-center gap-x-2 text-[15px] text-[--on-ink-2]">
        <span>{t('public.quickActions.lobbiesLabel')}</span>
        {LOBBY_LINKS.map(({ key, to }, index) => (
          <span key={key} className="contents">
            {index > 0 && <span aria-hidden="true">·</span>}
            <Link
              to={to}
              className="inline-flex min-h-11 items-center rounded-md px-1 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              {t(`public.quickActions.${key}`)}
            </Link>
          </span>
        ))}
      </p>
    </LandingSection>
  );
};

export default ServiceCardsGrid;
