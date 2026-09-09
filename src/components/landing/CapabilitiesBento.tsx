import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Smartphone, UserX } from 'lucide-react';
import { LandingSection, SectionHeading } from '@/components/landing/LandingSection';
import { TicketNumber } from '@/components/landing/fx';
import { COUNTER, FIRST_TICKET } from '@/components/landing/useCallHeartbeat';

/**
 * Six shipped capabilities as a bento grid. Each tile pairs the existing
 * capability copy with a small vignette drawn in markup only (no images).
 * Vignettes are decorative and hidden from assistive tech; every ticket
 * number in them is a TicketNumber that rolls +1 when the tile is hovered
 * or focused (`offset`), one roll per hover, never a loop.
 */
interface VignetteProps {
  offset: number;
}

const vignetteFrame = 'qf-vignette pointer-events-none select-none rounded-xl border border-[--hairline] bg-[--cream] p-4';
const KIOSK_TICKET = 47;

const TrackerVignette: React.FC<VignetteProps> = ({ offset }) => {
  const { t } = useTranslation();
  return (
    <div aria-hidden="true" className={vignetteFrame + ' flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-6'}>
      <div className="flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[--text-2]">
          {t('public.capabilities.vignettes.tracker.label')}
        </p>
        <p className="qf-stub-num mt-1.5 text-[28px] text-[--text-1]">{t('public.preview.position', { position: 3 })}</p>
        <p className="mt-1 text-[13px] text-[--text-2]">{t('public.preview.eta', { minutes: 12 })}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full w-[55%] rounded-full bg-[--brand]" />
        </div>
      </div>
      <ol className="flex w-full flex-col gap-1.5 sm:w-[190px]">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className={
              'flex items-center justify-between rounded-lg px-3 py-1.5 text-[12px] font-semibold tabular-nums ' +
              (i === 0 ? 'qf-chip-serving' : 'bg-white text-[--text-1]')
            }
          >
            <TicketNumber value={FIRST_TICKET + offset + i} />
            <span className={i === 0 ? '' : 'font-normal text-[--text-2]'}>
              {i === 0 ? t('public.board.nowServing') : t('public.board.waitMinutes', { minutes: 4 * i })}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

const KioskVignette: React.FC<VignetteProps> = ({ offset }) => {
  const { t } = useTranslation();
  return (
    <div aria-hidden="true" className={vignetteFrame + ' flex items-center justify-center gap-4'}>
      <div className="qf-stub-shadow w-[150px]">
        <div className="qf-stub-paper qf-perf-top rounded-xl p-3 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[--text-2]">
            {t('public.capabilities.vignettes.kiosk.ticket')}
          </p>
          <p className="qf-stub-num mt-1 text-[24px] text-[--text-1]">
            <TicketNumber value={KIOSK_TICKET + offset} />
          </p>
          <p className="mt-0.5 text-[11px] text-[--text-2]">{t('public.preview.services.renewal')}</p>
          <div className="mt-2 grid grid-cols-6 gap-0.5">
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} className={'h-1.5 rounded-sm ' + ((i * 7) % 3 === 0 ? 'bg-[--text-1]' : 'bg-[--hairline]')} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="rounded-full bg-[--brand] px-3 py-1.5 text-center text-[12px] font-semibold text-white">
          {t('public.capabilities.vignettes.kiosk.takeTicket')}
        </span>
        <span className="rounded-full border border-[--hairline] bg-white px-3 py-1.5 text-center text-[12px] font-semibold text-[--text-1]">
          {t('public.capabilities.vignettes.kiosk.bookOnline')}
        </span>
      </div>
    </div>
  );
};

const CodeVignette: React.FC<VignetteProps> = () => {
  const { t } = useTranslation();
  return (
    <div aria-hidden="true" className={vignetteFrame}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[--text-2]">
        {t('public.capabilities.vignettes.checkIn.label')}
      </p>
      <div className="mt-2 flex items-center justify-between rounded-lg border border-[--brand] bg-white px-3 py-2.5 ring-2 ring-[rgba(37,99,235,0.15)]">
        <span className="qf-signage text-[18px] font-bold tracking-[0.12em] text-[--text-1]">APT-7F3A</span>
        <span className="h-5 w-px bg-[--brand]" />
      </div>
      <span className="mt-3 inline-flex rounded-full bg-[--brand] px-3 py-1.5 text-[12px] font-semibold text-white">
        {t('public.capabilities.vignettes.checkIn.button')}
      </span>
    </div>
  );
};

const StaffVignette: React.FC<VignetteProps> = ({ offset }) => {
  const { t } = useTranslation();
  return (
    <div aria-hidden="true" className={vignetteFrame}>
      <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-[12px]">
        <TicketNumber value={FIRST_TICKET + offset} className="font-bold text-[--text-1]" />
        <span className="qf-chip-serving rounded-full px-2 py-0.5 text-[11px] font-semibold">{t('public.board.nowServing')}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-[--brand] px-3 py-1.5 text-[12px] font-semibold text-white">
          {t('public.preview.callNext')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[--hairline] bg-white px-3 py-1.5 text-[12px] font-semibold text-[--text-1]">
          <Check className="size-3.5 text-[--brand]" /> {t('public.capabilities.vignettes.staff.served')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[--hairline] bg-white px-3 py-1.5 text-[12px] font-semibold text-[--text-1]">
          <UserX className="size-3.5 text-[--text-2]" /> {t('public.capabilities.vignettes.staff.noShow')}
        </span>
      </div>
    </div>
  );
};

const VirtualVignette: React.FC<VignetteProps> = () => {
  const { t } = useTranslation();
  return (
    <div aria-hidden="true" className={vignetteFrame + ' flex items-center gap-4'}>
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[--brand] shadow-[var(--shadow-card)]">
        <Smartphone className="size-5" />
      </div>
      <div className="min-w-0">
        <span className="inline-flex rounded-full bg-[rgba(37,99,235,0.1)] px-2.5 py-1 text-[12px] font-semibold text-[--brand-deep]">
          {t('public.capabilities.vignettes.virtual.joined')}
        </span>
        <p className="mt-1.5 text-[13px] text-[--text-2]">{t('public.capabilities.vignettes.virtual.arrive')}</p>
      </div>
    </div>
  );
};

const BARS = [46, 62, 38, 70, 54, 30, 22];

const AnalyticsVignette: React.FC<VignetteProps> = () => {
  const { t } = useTranslation();
  const days = t('public.capabilities.vignettes.analytics.dayLabels').split(',');
  return (
    <div aria-hidden="true" className={vignetteFrame}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[--text-2]">
          {t('public.capabilities.vignettes.analytics.label')}
        </p>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-[--text-2]">
          {t('public.capabilities.vignettes.analytics.locations', { n: 3 })}
        </span>
      </div>
      <div className="mt-3 flex h-[72px] items-end gap-1.5">
        {BARS.map((h, i) => (
          <div
            key={i}
            className={'flex-1 rounded-t-sm ' + (i === 3 ? 'bg-[--brand]' : 'bg-[rgba(37,99,235,0.28)]')}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {days.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[10px] font-medium text-[--text-2]">
            {d.trim()}
          </span>
        ))}
      </div>
    </div>
  );
};

/** The hero board at small scale, so the motif closes the loop. */
const SignageVignette: React.FC<VignetteProps> = ({ offset }) => {
  const { t } = useTranslation();
  const serving = FIRST_TICKET + offset;
  return (
    <div aria-hidden="true" className="qf-vignette qf-board pointer-events-none relative select-none overflow-hidden p-4 text-white [border-radius:12px]">
      <div className="qf-led-glow absolute left-0 top-1/2 h-[160%] w-1/2 -translate-y-1/2 rounded-full" />
      <div className="relative flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[--on-ink-2]">
        <span className="truncate">{t('public.board.location')}</span>
        <span className="qf-board-label shrink-0 !text-[11px]">{t('public.board.nowServing')}</span>
      </div>
      <div className="relative mt-2 flex items-end justify-between gap-3">
        <TicketNumber value={serving} className="qf-board-digits qf-led qf-led-sm !text-[44px]" />
        <span className="text-[12px] text-[--on-ink-2]">{t('public.board.counter', { number: COUNTER })}</span>
      </div>
      <div className="relative mt-3 grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className="rounded-md bg-white/10 py-1.5 text-center text-[13px] font-semibold tabular-nums">
            <TicketNumber value={serving + i} />
          </span>
        ))}
      </div>
    </div>
  );
};

const TILES = [
  { key: 'live', span: 'lg:col-span-7', Vignette: TrackerVignette },
  { key: 'kiosk', span: 'lg:col-span-5', Vignette: KioskVignette },
  { key: 'checkIn', span: 'lg:col-span-4', Vignette: CodeVignette },
  { key: 'staff', span: 'lg:col-span-4', Vignette: StaffVignette },
  { key: 'virtual', span: 'lg:col-span-4', Vignette: VirtualVignette },
  { key: 'analytics', span: 'lg:col-span-6', Vignette: AnalyticsVignette },
  { key: 'signage', span: 'lg:col-span-6', Vignette: SignageVignette },
] as const;

const Tile: React.FC<{ tile: (typeof TILES)[number] }> = ({ tile }) => {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);
  const bump = () => setOffset((o) => o + 1);
  const { key, span, Vignette } = tile;
  return (
    <li
      className={'reveal qf-card qf-card-hover flex flex-col p-6 ' + span + (key === 'live' ? ' sm:col-span-2' : '')}
      onMouseEnter={bump}
      onFocus={bump}
    >
      <h3 className="qf-h3 text-[--text-1]">{t(`public.capabilities.items.${key}.title`)}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[--text-2]">{t(`public.capabilities.items.${key}.description`)}</p>
      <div className="mt-auto pt-6">
        <Vignette offset={offset} />
      </div>
    </li>
  );
};

const CapabilitiesBento: React.FC = () => {
  const { t } = useTranslation();

  return (
    <LandingSection id="capabilities" tone="cream" grain={0.035} labelledBy="landing-capabilities-title">
      <SectionHeading
        id="landing-capabilities-title"
        eyebrow={t('public.capabilities.eyebrow')}
        title={t('public.capabilities.title')}
        description={t('public.capabilities.subtitle')}
        called
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {TILES.map((tile) => (
          <Tile key={tile.key} tile={tile} />
        ))}
      </ul>
    </LandingSection>
  );
};

export default CapabilitiesBento;
