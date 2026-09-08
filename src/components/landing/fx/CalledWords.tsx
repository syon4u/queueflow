import React from 'react';
import * as m from 'motion/react-m';
import type { Variants } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Headline whose words are "called" one at a time, like tickets being read
 * off a lobby board: each word rises 0.6em, un-blurs and settles with a
 * slight overshoot. Takes the already-translated string (from `t()`), so
 * it works for EN/ES/PT/HT without touching i18n keys.
 *
 * Accessibility: the wrapper carries the full sentence as `aria-label`, the
 * per-word spans are `aria-hidden`, so screen readers get one clean string.
 * Under prefers-reduced-motion (<MotionConfig reducedMotion="user">) the
 * transforms are skipped and words simply fade in.
 *
 * Render exactly one of these as the page `h1` via `as="h1"`.
 */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: '0.6em', filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 },
  },
};

type Tag = 'h1' | 'h2' | 'p' | 'span';
const tags = { h1: m.h1, h2: m.h2, p: m.p, span: m.span } as const;

interface CalledWordsProps {
  text: string;
  as?: Tag;
  className?: string;
  wordClassName?: string;
  /** Word indexes (0-based) to render with `accentClassName`, e.g. an italic serif. */
  accent?: number[];
  accentClassName?: string;
  id?: string;
  /** Start when scrolled into view (default) or immediately on mount. */
  startOnView?: boolean;
}

export const CalledWords: React.FC<CalledWordsProps> = ({
  text,
  as = 'span',
  className,
  wordClassName,
  accent = [],
  accentClassName,
  id,
  startOnView = true,
}) => {
  const Tag = tags[as];
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag
      id={id}
      aria-label={text}
      className={cn('inline-block', className)}
      variants={container}
      initial="hidden"
      {...(startOnView ? { whileInView: 'show', viewport: { once: true, amount: 0.6 } } : { animate: 'show' })}
    >
      {words.flatMap((w, i) => [
        <m.span
          key={i}
          aria-hidden="true"
          className={cn('inline-block will-change-transform', wordClassName, accent.includes(i) && accentClassName)}
          variants={word}
        >
          {w}
        </m.span>,
        i < words.length - 1 ? ' ' : null,
      ])}
    </Tag>
  );
};

export default CalledWords;
