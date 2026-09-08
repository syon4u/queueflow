import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logoTile from '@/assets/logo-tile.svg';
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/components/landing/CTASection';

const CUSTOMER_LINKS = [
  { key: 'book', to: '/customer' },
  { key: 'checkIn', to: '/check-in' },
  { key: 'status', to: '/status' },
  { key: 'find', to: '/appointment-lookup' },
] as const;

const LOBBY_LINKS = [
  { key: 'kiosk', to: '/kiosk' },
  { key: 'signage', to: '/digital-signage' },
  { key: 'virtualQueue', to: '/virtual-queue' },
] as const;

const COMPANY_LINKS = [
  { key: 'pricing', to: '/pricing' },
  { key: 'staffSignIn', to: '/login' },
] as const;

const linkClass =
  'inline-flex min-h-11 items-center rounded-sm text-sm text-gray-600 hover:text-blue-700 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

/** Lighter footer for the public landing page: only routes that exist. */
const LandingFooter: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
              <img src={logoTile} alt="" width={32} height={32} className="size-8 rounded-lg" />
              <span className="text-lg font-bold text-gray-900">QueueFlow</span>
            </Link>
            <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-gray-600">{t('public.footer.tagline')}</p>
          </div>

          <nav aria-label={t('public.footer.forCustomers')}>
            <h2 className="font-sans text-sm font-semibold tracking-normal text-gray-900">{t('public.footer.forCustomers')}</h2>
            <ul className="mt-2 flex flex-col">
              {CUSTOMER_LINKS.map(({ key, to }) => (
                <li key={key}>
                  <Link to={to} className={linkClass}>
                    {t(`public.quickActions.${key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('public.footer.forLobbies')}>
            <h2 className="font-sans text-sm font-semibold tracking-normal text-gray-900">{t('public.footer.forLobbies')}</h2>
            <ul className="mt-2 flex flex-col">
              {LOBBY_LINKS.map(({ key, to }) => (
                <li key={key}>
                  <Link to={to} className={linkClass}>
                    {t(`public.quickActions.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-sm font-semibold tracking-normal text-gray-900">{t('public.footer.company')}</h2>
            <ul className="mt-2 flex flex-col">
              {COMPANY_LINKS.map(({ key, to }) => (
                <li key={key}>
                  <Link to={to} className={linkClass}>
                    {t(`public.footer.${key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <a href={CONTACT_MAILTO} className={linkClass}>
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">{t('public.layout.footer.supportHours')}</p>
          </div>
        </div>

        <p className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-600">
          {t('public.layout.footer.rights', { year })}
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
