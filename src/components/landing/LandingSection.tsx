import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared rhythm for the public landing page: every section gets the same
 * vertical padding and the same container width, so cards in a row share
 * edges and the page reads as one system. Sections override only `tone`.
 *
 * Tones map to the landing palette: paper (white), mist (alternate), ink
 * (navy ground for the hero, final CTA and footer).
 */
type Tone = 'paper' | 'mist' | 'ink';

const toneClass: Record<Tone, string> = {
  paper: 'bg-[--paper] text-[--text-1]',
  mist: 'bg-[--mist] text-[--text-1]',
  ink: 'on-ink bg-[--ink] text-white',
};

interface LandingSectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  labelledBy?: string;
  children: React.ReactNode;
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  tone = 'paper',
  labelledBy,
  className,
  children,
  ...rest
}) => (
  <section
    aria-labelledby={labelledBy}
    className={cn('scroll-mt-16 py-16 sm:py-24', toneClass[tone], className)}
    {...rest}
  >
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">{children}</div>
  </section>
);

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  onInk?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  onInk = false,
}) => (
  <div className={cn('mb-10 max-w-2xl sm:mb-14', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
    {eyebrow && <p className="qf-eyebrow reveal mb-4">{eyebrow}</p>}
    <h2
      id={id}
      className={cn(
        'reveal font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[40px]',
        onInk ? 'text-white' : 'text-[--text-1]'
      )}
    >
      {title}
    </h2>
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
