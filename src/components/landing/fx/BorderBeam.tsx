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
import { useReducedMotion, type Transition } from 'motion/react';
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
}) => {
  // offsetDistance is not a transform, so MotionConfig's reducedMotion="user"
  // would let it loop; hold the beam still ourselves.
  const reduced = useReducedMotion();
  const beamStyle: React.CSSProperties = {
    width: size,
    offsetPath: `rect(0 auto auto 0 round ${size}px)`,
    backgroundImage: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
    ...style,
  };
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-transparent"
      style={{
        borderWidth,
        borderStyle: 'solid',
        // Two opaque layers, padding-box XOR border-box = the 1 px ring.
        WebkitMaskImage: 'linear-gradient(#000, #000), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'xor',
        maskImage: 'linear-gradient(#000, #000), linear-gradient(#000, #000)',
        maskClip: 'padding-box, border-box',
        maskComposite: 'exclude',
      }}
    >
      {reduced ? (
        <div className={cn('absolute aspect-square', className)} style={{ ...beamStyle, offsetDistance: `${initialOffset}%` }} />
      ) : (
        <m.div
          className={cn('absolute aspect-square', className)}
          style={beamStyle}
          initial={{ offsetDistance: `${initialOffset}%` }}
          animate={{
            offsetDistance: reverse
              ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
              : [`${initialOffset}%`, `${100 + initialOffset}%`],
          }}
          transition={{ repeat: Infinity, ease: 'linear', duration, delay: -delay, ...transition }}
        />
      )}
    </div>
  );
};

export default BorderBeam;
