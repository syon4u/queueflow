import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import * as m from 'motion/react-m';
import { useScroll, useTransform } from 'motion/react';
import { TicketNumber } from '@/components/landing/fx';
import { COUNTER, servingTicket, ticketLabel } from '@/components/landing/useCallHeartbeat';

/* Canvas LED field: its own chunk, fetched only by the hero, only without
   reduced motion. The static amber dot field painted by `.qf-board` is the
   Suspense fallback and the reduced-motion state. */
const FlickeringGrid = React.lazy(() => import('@/components/landing/fx/FlickeringGrid'));

interface LedBoardProps {
  head: number;
  reduced: boolean;
  className?: string;
}

/**
 * The wall board: NOW SERVING A-042 in amber dot-matrix, hanging behind the
 * hero copy. Decoration for assistive tech — the meaning ("now serving
 * A-042") is in one visually-hidden sentence, and the polite live region in
 * HeroSection speaks only on a user-triggered "Call next".
 */
const LedBoard: React.FC<LedBoardProps> = ({ head, reduced, className }) => {
  const { t } = useTranslation();
  const serving = servingTicket(head);

  // Parallax: transform + opacity only, over roughly the first 80 vh.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 640], [0, 80]);
  const opacity = useTransform(scrollY, [0, 640], [1, 0.35]);

  return (
    <m.div style={reduced ? undefined : { y, opacity }} className={className}>
      <p className="sr-only">
        {t('public.board.example')} — {t('public.board.caption')}: {t('public.board.nowServing')} {ticketLabel(serving)}.{' '}
        {t('public.board.counter', { number: COUNTER })}. {t('public.board.upNext')} {ticketLabel(serving + 1)}.
      </p>
      <div aria-hidden="true" className="qf-board relative isolate overflow-hidden">
        {!reduced && (
          <Suspense fallback={null}>
            <div className="absolute inset-0 -z-10">
              <FlickeringGrid squareSize={3} gridGap={5} color="#FFB020" maxOpacity={0.18} flickerChance={0.12} />
            </div>
          </Suspense>
        )}
        <div className="qf-led-glow pointer-events-none absolute left-[-6%] top-1/2 -z-10 h-[140%] w-[70%] -translate-y-1/2 rounded-full" />

        <div className="relative px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-7">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="qf-board-label">{t('public.board.nowServing')}</p>
            <p className="qf-signage flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[--on-ink-2] sm:text-[13px]">
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white">
                {t('public.board.example')}
              </span>
              <span className="hidden sm:inline">{t('public.board.counter', { number: COUNTER })}</span>
              <span className="hidden text-[--led] sm:inline">·</span>
              <span className="inline-flex items-center gap-1.5">
                {t('public.board.upNext')}
                <TicketNumber value={serving + 1} className="text-[--led]" duration={700} />
              </span>
            </p>
          </div>

          <div className="mt-3 sm:mt-4">
            <TicketNumber value={serving} className="qf-board-digits qf-led" duration={700} />
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default LedBoard;
