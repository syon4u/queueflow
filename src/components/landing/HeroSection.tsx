import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as m from 'motion/react-m';
import { ArrowRight, Languages, ListOrdered, Smartphone } from 'lucide-react';
import ProductPreview from '@/components/landing/ProductPreview';
import LedBoard from '@/components/landing/LedBoard';
import { CalledWords, Grain } from '@/components/landing/fx';
import { COUNTER, servingTicket, ticketLabel, useCallHeartbeat } from '@/components/landing/useCallHeartbeat';

/** Three true product facts shown under the hero buttons, as ticket stubs. */
const FACTS = [
  { key: 'oneLine', icon: ListOrdered },
  { key: 'livePosition', icon: Smartphone },
  { key: 'languages', icon: Languages },
] as const;

const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/** Index of the headline word that carries the translated accent word (e.g. "Calmer"). */
const accentIndex = (headline: string, accent: string) => {
  const norm = (s: string) => s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const target = norm(accent);
  if (!target) return -1;
  return headline
    .split(/\s+/)
    .filter(Boolean)
    .findIndex((w) => norm(w) === target);
};

/**
 * The lobby. A full-width LED wall board reads NOW SERVING; the headline is
 * called onto the page word by word; the staff dashboard hangs in front of
 * the board with the customer's phone ticket overlapping it. Board, mock and
 * ticket share one heartbeat (`useCallHeartbeat`), so every "Call next" —
 * the 4 s interval or the visitor's own press — advances all three at once.
 */
const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { head, callNext, announcedHead, reduced } = useCallHeartbeat();
  const hintId = useId();

  const headline = t('public.hero.headline');
  const accent = accentIndex(headline, t('public.hero.headlineAccent'));

  return (
    <section
      aria-labelledby="landing-hero-title"
      className="on-ink relative isolate overflow-hidden border-t border-white/[0.12] bg-[--ink] text-white"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-8 lg:pb-32">
        <LedBoard head={head} reduced={reduced} className="relative z-0" />

        <div className="mt-10 grid items-start gap-14 sm:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 lg:pt-4">
            <m.p
              className="qf-eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {t('public.hero.eyebrow')}
            </m.p>
            <CalledWords
              as="h1"
              id="landing-hero-title"
              text={headline}
              startOnView={false}
              accent={accent >= 0 ? [accent] : []}
              accentClassName="qf-accent text-[--led]"
              className="qf-h1 mt-5 max-w-[16ch] text-white"
            />
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.6, ease: EASE_OUT_QUART }}
            >
              <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.6] text-[--on-ink-2] sm:text-lg">
                {t('public.hero.subline')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/pricing" className="qf-btn qf-btn-brand">
                  {t('public.hero.seePricing')}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link to="/customer" className="qf-btn qf-btn-outline-ink">
                  {t('public.hero.tryDemo')}
                </Link>
              </div>
            </m.div>

            <m.ul
              className="mt-10 grid gap-3 sm:grid-cols-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.75, ease: EASE_OUT_QUART }}
            >
              {FACTS.map(({ key, icon: Icon }, i) => (
                <li key={key} className="qf-stub-shadow flex">
                  <div className="qf-stub qf-perf-top flex w-full flex-col rounded-xl px-3.5 pb-3.5 pt-4">
                    <span className="flex items-center justify-between text-[--stamp]">
                      <span className="qf-stub-num text-[14px]">0{i + 1}</span>
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="mt-2 text-[14px] font-medium leading-snug text-[--text-1]">{t(`public.hero.facts.${key}`)}</span>
                  </div>
                </li>
              ))}
            </m.ul>
          </div>

          <div className="relative z-10 lg:col-span-6 lg:-mt-24">
            <ProductPreview head={head} onCallNext={callNext} hintId={hintId} />
            <p id={hintId} className="sr-only">
              {t('public.preview.callNextHint')}
            </p>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcedHead === null
          ? ''
          : t('public.board.ariaLive', { ticket: ticketLabel(servingTicket(announcedHead)), number: COUNTER })}
      </p>
      <Grain opacity={0.06} />
    </section>
  );
};

export default HeroSection;
