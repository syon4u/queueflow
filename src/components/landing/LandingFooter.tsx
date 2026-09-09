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
  'inline-flex min-h-11 items-center rounded-md text-[15px] text-[--on-ink-2] transition-colors hover:text-white';
const headingClass = 'text-[13px] font-semibold uppercase tracking-[0.1em] text-white';

/** Landing footer on the ink ground: only routes that exist. */
const LandingFooter: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="on-ink border-t border-white/10 bg-[--ink] py-14 text-white">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-lg">
              <img src={logoTile} alt="" width={32} height={32} className="size-8 rounded-lg" />
              <span className="qf-wordmark text-[19px] text-white">QueueFlow</span>
            </Link>
            <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-[--on-ink-2]">{t('public.footer.tagline')}</p>
          </div>

          <nav aria-label={t('public.footer.forCustomers')}>
            <h2 className={headingClass}>{t('public.footer.forCustomers')}</h2>
            <ul className="mt-3 flex flex-col">
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
            <h2 className={headingClass}>{t('public.footer.forLobbies')}</h2>
            <ul className="mt-3 flex flex-col">
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
            <h2 className={headingClass}>{t('public.footer.company')}</h2>
            <ul className="mt-3 flex flex-col">
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
            <p className="mt-2 text-[14px] text-[--on-ink-2]">{t('public.layout.footer.supportHours')}</p>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-[14px] text-[--on-ink-2]">
          {t('public.layout.footer.rights', { year })}
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
