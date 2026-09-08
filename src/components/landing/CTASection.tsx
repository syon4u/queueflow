import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as m from 'motion/react-m';
import { useInView, useReducedMotion } from 'motion/react';
import { Mail } from 'lucide-react';
import { CalledWords, Grain, MotionProvider, TicketNumber } from '@/components/landing/fx';

export const CONTACT_EMAIL = 'info@garrickinternational.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('QueueFlow')}`;

/** The visitor's own ticket: rolls once, from the number before it, when the section enters view. */
const YOUR_TICKET = 47;

/**
 * Final buyer call to action on the ink ground: the board calls one more
 * number — the visitor's — and "Your turn." lands under it. Also rendered
 * at the foot of the pricing page, so it carries the `landing` scope class
 * and its own MotionProvider.
 */
const CTASection: React.FC = () => {
  const { t } = useTranslation();
  const boardRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(boardRef, { once: true, amount: 0.9 });
  const reduced = useReducedMotion();
  const called = reduced || inView;

  return (
    <MotionProvider>
      <section
        aria-labelledby="landing-cta-title"
        className="landing on-ink relative isolate overflow-hidden bg-[--ink] py-20 text-white sm:py-28"
      >
        <div
          aria-hidden="true"
          className="qf-led-glow pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        />
        <div className="mx-auto w-full max-w-6xl px-5 text-center sm:px-6">
          <p ref={boardRef} className="flex flex-col items-center gap-3">
            <span className="qf-board-label">{t('public.board.nowServing')}</span>
            <span className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1">
              <TicketNumber value={called ? YOUR_TICKET : YOUR_TICKET - 1} className="qf-board-digits qf-led qf-led-sm !text-[64px] sm:!text-[80px]" />
              <m.span
                className="qf-accent text-[40px] leading-none text-[--led] sm:text-[52px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: called ? 1 : 0 }}
                transition={{ duration: 0.4, delay: reduced ? 0 : 0.8 }}
              >
                {t('public.cta.yourTurn')}
              </m.span>
            </span>
          </p>
          <CalledWords as="h2" id="landing-cta-title" text={t('public.cta.headline')} className="qf-h2 mx-auto mt-8 max-w-[18ch] text-white" />
          <p className="reveal mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-[--on-ink-2] sm:text-lg">
            {t('public.cta.subtitle')}
          </p>
          <div className="reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={CONTACT_MAILTO} className="qf-btn qf-btn-brand w-full sm:w-auto">
              <Mail aria-hidden="true" className="size-4" />
              {t('public.cta.talkToUs')}
            </a>
            <Link to="/customer" className="qf-btn qf-btn-outline-ink w-full sm:w-auto">
              {t('public.cta.tryDemo')}
            </Link>
          </div>
          <p className="reveal mt-7 text-[14px] text-[--on-ink-2]">
            <a
              href={CONTACT_MAILTO}
              className="inline-flex min-h-11 items-center rounded-md text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
        <Grain opacity={0.06} />
      </section>
    </MotionProvider>
  );
};

export default CTASection;
