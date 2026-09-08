import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone } from 'lucide-react';

const SERVICES = ['account', 'renewal', 'enquiry', 'payment', 'consultation'] as const;
const ROWS = 5;
const ADVANCE_MS = 4000;
const FIRST_TICKET = 42;
const WAITS = [0, 4, 8, 11, 15];

const ticketLabel = (n: number) => `A-${String(n).padStart(3, '0')}`;

/**
 * Markup-only mock of the staff dashboard inside a browser frame, with the
 * customer's phone ticket overlapping it. Example data only, labelled as such.
 * The "now serving" ticket advances every four seconds (paused under
 * prefers-reduced-motion) so the mock reads as a live product, not a picture.
 */
const ProductPreview: React.FC = () => {
  const { t } = useTranslation();
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setHead((h) => (h + 1) % 900), ADVANCE_MS);
    return () => window.clearInterval(id);
  }, []);

  const rows = Array.from({ length: ROWS }, (_, i) => {
    const n = FIRST_TICKET + head + i;
    return { n, ticket: ticketLabel(n), service: SERVICES[n % SERVICES.length], wait: WAITS[i] };
  });
  const serving = rows[0];

  const stats = [
    { key: 'waiting', value: '6' },
    { key: 'beingServed', value: '2' },
    { key: 'avgWait', value: t('public.board.waitMinutes', { minutes: 11 }) },
    { key: 'servedToday', value: '38' },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      {/* Browser frame */}
      <figure
        aria-label={t('public.preview.ariaLabel')}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[--ink-2] text-white shadow-[var(--shadow-glow)]"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="size-2.5 rounded-full bg-white/20" />
            <i className="size-2.5 rounded-full bg-white/20" />
            <i className="size-2.5 rounded-full bg-white/20" />
          </span>
          <span
            aria-hidden="true"
            className="flex h-7 flex-1 items-center rounded-md bg-white/5 px-3 text-[12px] font-medium text-[--on-ink-2]"
          >
            queueflow <span className="mx-1 text-white/30">/</span> staff
          </span>
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
            {t('public.board.example')}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-[15px] font-semibold text-white">{t('public.board.location')}</p>
            <p className="shrink-0 text-[13px] text-[--on-ink-2]">{t('public.preview.timestamp')}</p>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map(({ key, value }) => (
              <div key={key} className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2.5">
                <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-[--on-ink-2]">
                  {t(`public.preview.stats.${key}`)}
                </dt>
                <dd className="font-display mt-1 whitespace-nowrap text-[20px] font-bold leading-none tabular-nums text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <div className="flex items-center justify-between bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[--on-ink-2]">
              <span>{t('public.preview.queue')}</span>
              <span>{t('public.preview.wait')}</span>
            </div>
            <ul aria-live="off" className="divide-y divide-white/10">
              {rows.map((row, i) => (
                <li
                  key={row.n}
                  className={
                    'flex items-center gap-3 px-3 py-2.5 ' + (i === 0 ? 'bg-white/[0.06]' : i === ROWS - 1 ? 'qf-row-in' : '')
                  }
                >
                  <span
                    className={'w-[52px] shrink-0 font-display text-[14px] font-bold tabular-nums ' + (i === 0 ? 'qf-ticket-swap' : '')}
                  >
                    {row.ticket}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-white/90">
                    {t(`public.preview.services.${row.service}`)}
                  </span>
                  {i === 0 ? (
                    <span className="shrink-0 rounded-full bg-[rgba(245,158,11,0.15)] px-2.5 py-1 text-[11px] font-semibold text-[--led]">
                      {t('public.board.nowServing')}
                    </span>
                  ) : (
                    <span className="shrink-0 text-[12px] tabular-nums text-[--on-ink-2]">
                      {t('public.board.waitMinutes', { minutes: row.wait })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[12px] text-[--on-ink-2]">
              {t('public.board.counter', { number: 3 })} · {t('public.preview.nextUp', { ticket: rows[1].ticket })}
            </p>
            <span
              aria-hidden="true"
              className="inline-flex h-9 items-center rounded-full bg-[--brand] px-4 text-[13px] font-semibold text-white shadow-[var(--shadow-card)]"
            >
              {t('public.preview.callNext')}
            </span>
          </div>
        </div>
        <figcaption className="sr-only">{t('public.preview.caption', { ticket: serving.ticket })}</figcaption>
      </figure>

      {/* Customer ticket (phone view) */}
      <figure
        aria-label={t('public.preview.ticketAria')}
        className="relative mx-auto mt-4 w-[240px] rounded-3xl bg-white p-4 text-[--text-1] shadow-[0_1px_2px_rgba(15,23,42,.06),0_24px_48px_-16px_rgba(15,23,42,.45)] lg:absolute lg:-bottom-14 lg:-left-10 lg:mt-0"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[--text-2]">
          <Smartphone aria-hidden="true" className="size-3.5 text-[--brand]" />
          {t('public.preview.yourTicket', { ticket: ticketLabel(FIRST_TICKET + head + 3) })}
        </div>
        <p className="font-display mt-3 text-[26px] font-bold leading-none tracking-[-0.02em]">
          {t('public.preview.position', { position: 3 })}
        </p>
        <p className="mt-1.5 text-[14px] text-[--text-2]">{t('public.preview.eta', { minutes: 12 })}</p>
        <div
          role="progressbar"
          aria-label={t('public.preview.progressLabel')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={55}
          className="mt-4 h-2 overflow-hidden rounded-full bg-[--cream]"
        >
          <div className="h-full w-[55%] rounded-full bg-[--brand]" />
        </div>
        <p className="mt-2 text-[12px] text-[--text-2]">{t('public.preview.ahead', { n: 2 })}</p>
      </figure>
    </div>
  );
};

export default ProductPreview;
