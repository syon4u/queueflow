import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A static, markup-only mock of the lobby signage board. Example data only —
 * it is labelled as such in the UI and never reads from the backend.
 */
const LiveBoardExample: React.FC = () => {
  const { t } = useTranslation();
  const upNext = ['A-043', 'A-044', 'A-045'];

  return (
    <figure
      aria-label={t('public.board.ariaLabel')}
      className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/70 p-5 text-white shadow-2xl shadow-blue-950/40 backdrop-blur-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-blue-100">{t('public.board.location')}</p>
          <p className="text-xs text-blue-200/80">{t('public.board.caption')}</p>
        </div>
        <span className="shrink-0 rounded-full border border-amber-300/40 bg-amber-300/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
          {t('public.board.example')}
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-blue-600 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">{t('public.board.nowServing')}</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">A-042</span>
          <span className="text-sm font-medium text-blue-100">{t('public.board.counter', { number: 3 })}</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">{t('public.board.upNext')}</p>
        <ol className="mt-2 grid grid-cols-3 gap-2">
          {upNext.map((ticket) => (
            <li
              key={ticket}
              className="rounded-lg border border-white/10 bg-white/5 py-2.5 text-center text-lg font-semibold tabular-nums"
            >
              {ticket}
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
        <span className="text-blue-100">{t('public.board.averageWait')}</span>
        <span className="font-semibold tabular-nums">{t('public.board.waitMinutes', { minutes: 12 })}</span>
      </figcaption>
    </figure>
  );
};

export default LiveBoardExample;
