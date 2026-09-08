import React from 'react';
import { cn } from '@/lib/utils';
import { CalledWords, Grain } from '@/components/landing/fx';

/**
 * Shared rhythm for the public landing page: every section gets the same
 * vertical padding and the same container width, so cards in a row share
 * edges and the page reads as one system. Sections override only `tone`.
 *
 * Tones map to the landing palette: paper (white), cream (thermal paper), ink
 * (navy ground for the hero, final CTA and footer). `grain` adds the film
 * grain overlay at the given opacity (0.06 on ink, 0.035 on cream).
 */
type Tone = 'paper' | 'cream' | 'ink';

const toneClass: Record<Tone, string> = {
  paper: 'bg-[--paper] text-[--text-1]',
  cream: 'bg-[--cream] text-[--text-1]',
  ink: 'on-ink bg-[--ink] text-white',
};

interface LandingSectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  labelledBy?: string;
  grain?: number;
  children: React.ReactNode;
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  tone = 'paper',
  labelledBy,
  grain,
  className,
  children,
  ...rest
}) => (
  <section
    aria-labelledby={labelledBy}
    className={cn('relative isolate scroll-mt-16 overflow-hidden py-16 sm:py-24', toneClass[tone], className)}
    {...rest}
  >
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">{children}</div>
    {grain ? <Grain opacity={grain} /> : null}
  </section>
);

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  onInk?: boolean;
  /** Call the title onto the page word by word (CalledWords) instead of the plain reveal. */
  called?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  onInk = false,
  called = false,
}) => (
  <div className={cn('mb-10 max-w-2xl sm:mb-14', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
    {eyebrow && <p className="qf-eyebrow reveal mb-4">{eyebrow}</p>}
    {called ? (
      <CalledWords as="h2" id={id} text={title} className={cn('qf-h2', onInk ? 'text-white' : 'text-[--text-1]')} />
    ) : (
      <h2 id={id} className={cn('qf-h2 reveal', onInk ? 'text-white' : 'text-[--text-1]')}>
        {title}
      </h2>
    )}
    {description && (
      <p
        className={cn(
          'reveal mt-4 max-w-[60ch] text-base leading-relaxed sm:text-lg',
          align === 'center' && 'mx-auto',
          onInk ? 'text-[--on-ink-2]' : 'text-[--text-2]'
        )}
      >
        {description}
      </p>
    )}
  </div>
);
