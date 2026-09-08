import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LiveBoardExample from '@/components/landing/LiveBoardExample';

const DOT_COUNT = 14;
const STEP_SECONDS = 0.7;

/**
 * Landing hero. Owned background: brand-blue to indigo gradient, a faint grid,
 * and a row of "now serving" ticket dots that advance one step at a time.
 * The motion is CSS-only and switches off under prefers-reduced-motion.
 */
const ModernHeroSection: React.FC = () => {
  const { t } = useTranslation();
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => i);

  return (
    <section
      aria-labelledby="landing-hero-title"
      className="relative isolate overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white"
    >
      <style>{`
        .qf-hero-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 0%, #000 30%, transparent 100%);
          mask-image: radial-gradient(ellipse 70% 80% at 50% 0%, #000 30%, transparent 100%);
        }
        .qf-hero-dot {
          opacity: 0.28;
          animation: qf-serve ${DOT_COUNT * STEP_SECONDS}s steps(1, end) infinite;
          animation-delay: calc(var(--i) * ${STEP_SECONDS}s);
        }
        @keyframes qf-serve {
          0%, ${(100 / DOT_COUNT).toFixed(3)}% { opacity: 1; transform: scale(1.5); }
          ${(100 / DOT_COUNT + 0.001).toFixed(3)}%, 100% { opacity: 0.28; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .qf-hero-dot { animation: none; }
          .qf-hero-dot[data-static="true"] { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* Owned background: soft grid + advancing ticket dots (decorative) */}
      <div aria-hidden="true" className="qf-hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 -z-10 flex justify-center gap-3 px-6 sm:gap-4"
      >
        {dots.map((i) => (
          <span
            key={i}
            data-static={i === 3 ? 'true' : undefined}
            style={{ '--i': i } as React.CSSProperties}
            className="qf-hero-dot block size-2 rounded-full bg-white sm:size-2.5"
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-100">
              {t('public.hero.eyebrow')}
            </p>
            <h1
              id="landing-hero-title"
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t('public.hero.headline')}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-blue-100 sm:text-xl">
              {t('public.hero.subline')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-12 w-full bg-white px-6 text-base font-semibold text-blue-800 shadow-lg shadow-blue-950/30 hover:bg-blue-50 hover:text-blue-900 focus-visible:ring-white focus-visible:ring-offset-blue-800 sm:w-auto"
              >
                <Link to="/pricing">
                  {t('public.hero.seePricing')}
                  <ArrowRight aria-hidden="true" className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full border-white/60 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10 hover:text-white focus-visible:ring-white focus-visible:ring-offset-blue-800 sm:w-auto"
              >
                <Link to="/customer">{t('public.hero.tryDemo')}</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-blue-100">
              <span>{t('public.hero.customerPrompt')}</span>{' '}
              <span className="inline-flex flex-wrap items-center gap-x-1">
                <Link to="/customer" className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800 rounded-sm">
                  {t('public.hero.customerBook')}
                </Link>
                <span aria-hidden="true">·</span>
                <Link to="/check-in" className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800 rounded-sm">
                  {t('public.hero.customerCheckIn')}
                </Link>
                <span aria-hidden="true">·</span>
                <Link to="/status" className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800 rounded-sm">
                  {t('public.hero.customerStatus')}
                </Link>
              </span>
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LiveBoardExample />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
