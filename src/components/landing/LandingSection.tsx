import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared rhythm for the public landing page: every section gets the same
 * vertical padding and the same container width, so cards in a row share
 * edges and the page reads as one system. Sections override only `tone`.
 */
type Tone = 'white' | 'muted' | 'brand';

const toneClass: Record<Tone, string> = {
  white: 'bg-white text-gray-900',
  muted: 'bg-gray-50 text-gray-900',
  brand: 'bg-blue-700 text-white',
};

interface LandingSectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  labelledBy?: string;
  children: React.ReactNode;
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  tone = 'white',
  labelledBy,
  className,
  children,
  ...rest
}) => (
  <section
    aria-labelledby={labelledBy}
    className={cn('py-16 sm:py-24', toneClass[tone], className)}
    {...rest}
  >
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
  </section>
);

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  onBrand?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  onBrand = false,
}) => (
  <div className={cn('mb-10 sm:mb-14', align === 'center' ? 'mx-auto text-center' : 'text-left', 'max-w-2xl')}>
    {eyebrow && (
      <p className={cn('mb-3 text-sm font-semibold uppercase tracking-wide', onBrand ? 'text-blue-100' : 'text-blue-700')}>
        {eyebrow}
      </p>
    )}
    <h2 id={id} className={cn('text-balance text-3xl font-bold tracking-tight sm:text-4xl', onBrand ? 'text-white' : 'text-gray-900')}>
      {title}
    </h2>
    {description && (
      <p className={cn('mt-4 max-w-[65ch] text-lg leading-relaxed', align === 'center' && 'mx-auto', onBrand ? 'text-blue-100' : 'text-gray-600')}>
        {description}
      </p>
    )}
  </div>
);
