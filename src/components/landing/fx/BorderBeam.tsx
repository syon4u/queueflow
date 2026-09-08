/**
 * BorderBeam — ported from Magic UI (https://magicui.design/docs/components/border-beam)
 * MIT License, Copyright (c) 2024 Dillion Verma. Adapted for Tailwind v3
 * (mask + gradient moved to inline styles) and for Motion's LazyMotion `m`
 * component so it costs ~0 kB beyond the shared `domAnimation` features.
 *
 * Drop it as the last child of a `relative overflow-hidden rounded-*` box.
 * Under prefers-reduced-motion the beam sits still at `initialOffset`.
 */
import React from 'react';
import * as m from 'motion/react-m';
import type { Transition } from 'motion/react';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
  /** Length of the beam in px. */
  size?: number;
  /** Seconds per lap. */
  duration?: number;
  /** Negative delay offsets the start so several beams can be desynced. */
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  reverse?: boolean;
  /** 0–100, where along the perimeter the beam starts. */
  initialOffset?: number;
  borderWidth?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = '#f59e0b',
  colorTo = '#38bdf8',
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 rounded-[inherit] border-transparent"
    style={{
      borderWidth,
      borderStyle: 'solid',
      WebkitMaskImage: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
      WebkitMaskClip: 'padding-box, border-box',
      WebkitMaskComposite: 'xor',
      maskImage: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
      maskClip: 'padding-box, border-box',
      maskComposite: 'exclude',
    }}
  >
    <m.div
      className={cn('absolute aspect-square', className)}
      style={{
        width: size,
        offsetPath: `rect(0 auto auto 0 round ${size}px)`,
        backgroundImage: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        ...style,
      }}
      initial={{ offsetDistance: `${initialOffset}%` }}
      animate={{
        offsetDistance: reverse
          ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
          : [`${initialOffset}%`, `${100 + initialOffset}%`],
      }}
      transition={{ repeat: Infinity, ease: 'linear', duration, delay: -delay, ...transition }}
    />
  </div>
);

export default BorderBeam;
