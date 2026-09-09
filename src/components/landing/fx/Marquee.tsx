/**
 * Marquee — ported from Magic UI (https://magicui.design/docs/components/marquee)
 * MIT License, Copyright (c) 2024 Dillion Verma. Adapted for Tailwind v3
 * (arbitrary-value syntax) and for prefers-reduced-motion (see fx.css).
 *
 * Requires the `marquee` / `marquee-vertical` keyframes + animations in
 * tailwind.config.js and the reduced-motion rule in ./fx.css.
 */
import React, { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import './fx.css';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /** Reverse the direction of travel. */
  reverse?: boolean;
  /** Pause while the pointer is over the strip. */
  pauseOnHover?: boolean;
  /** Scroll vertically instead of horizontally. */
  vertical?: boolean;
  /** How many copies of `children` to lay end to end (≥2 for a seamless loop). */
  repeat?: number;
  children: React.ReactNode;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'qf-marquee group flex gap-[var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? true : undefined}
          className={cn('flex shrink-0 justify-around gap-[var(--gap)]', {
            'animate-marquee flex-row': !vertical,
            'animate-marquee-vertical flex-col': vertical,
            'group-hover:[animation-play-state:paused]': pauseOnHover,
            '[animation-direction:reverse]': reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export default Marquee;
