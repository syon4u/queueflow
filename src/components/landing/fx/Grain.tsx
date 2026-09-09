import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Film-grain / paper-tooth overlay drawn with an inline SVG feTurbulence
 * filter — no image asset, ~600 bytes, GPU-composited. Put it as the last
 * child of a `relative` section; it is `pointer-events-none` and hidden from
 * assistive tech. Tune `opacity` per ground: ~0.06 on ink, ~0.035 on paper.
 * Uses `mix-blend-mode: overlay` so it darkens paper and lifts ink.
 */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  );

export const Grain: React.FC<{ className?: string; opacity?: number }> = ({ className, opacity = 0.05 }) => (
  <div
    aria-hidden="true"
    className={cn('pointer-events-none absolute inset-0 mix-blend-overlay', className)}
    style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: '160px 160px', opacity }}
  />
);

export default Grain;
