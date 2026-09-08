import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoTile from '@/assets/logo-tile.svg';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';

/** Anchor targets on the landing page, in page order. */
const SECTIONS = [
  { id: 'how-it-works', key: 'landingHowItWorks' },
  { id: 'capabilities', key: 'landingCapabilities' },
  { id: 'pricing', key: 'landingPricing' },
  { id: 'visitors', key: 'landingVisitors' },
] as const;

/**
 * Landing-page navigation: sticky, translucent, anchor links to the page's
 * own sections plus sign-in and the pricing call to action. Distinct from the
 * app-wide `Navigation`, which is route-based and role-aware.
 */
const LandingNav: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const jump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return; // let the browser follow the hash
    event.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
    setOpen(false);
  };

  const anchorClass =
    'inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium text-[--text-2] transition-colors hover:text-[--text-1]';

  return (
    <header className="sticky top-0 z-50 border-b border-[--hairline] bg-white/80 backdrop-blur-md">
      <nav aria-label={t('public.nav.landingLabel')} className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-2.5 rounded-lg">
          <img src={logoTile} alt="" width={32} height={32} className="size-8 rounded-lg" />
          <span className="qf-wordmark text-[19px] text-[--text-1]">QueueFlow</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map(({ id, key }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => jump(e, id)} className={anchorClass}>
                {t(`public.nav.${key}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Link to="/auth" className="qf-btn qf-btn-ghost qf-btn-sm">
            {t('public.nav.signIn')}
          </Link>
          <Link to="/pricing" className="qf-btn qf-btn-brand qf-btn-sm">
            {t('public.hero.seePricing')}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg text-[--text-1] hover:bg-[--cream] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('public.nav.closeMenu') : t('public.nav.openMenu')}
          aria-expanded={open}
          aria-controls="landing-mobile-menu"
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="landing-mobile-menu"
        hidden={!open}
        className={cn('border-t border-[--hairline] bg-white lg:hidden', open && 'shadow-[0_24px_48px_-24px_rgba(15,23,42,.25)]')}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-6">
          {SECTIONS.map(({ id, key }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => jump(e, id)}
              className="inline-flex min-h-12 items-center rounded-lg px-3 text-base font-medium text-[--text-1] hover:bg-[--cream]"
            >
              {t(`public.nav.${key}`)}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-[--hairline] pt-4">
            <div className="px-1">
              <LanguageSwitcher />
            </div>
            <Link
              to="/auth"
              className="inline-flex min-h-12 items-center rounded-lg px-3 text-base font-medium text-[--text-1] hover:bg-[--cream]"
              onClick={() => setOpen(false)}
            >
              {t('public.nav.signIn')}
            </Link>
            <Link to="/pricing" className="qf-btn qf-btn-brand" onClick={() => setOpen(false)}>
              {t('public.hero.seePricing')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
