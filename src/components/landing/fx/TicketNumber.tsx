import React from 'react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';

/**
 * A lobby-board ticket number ("A-042") whose digits roll like a mechanical
 * counter when `value` changes. Built on @number-flow/react (6 kB gzip,
 * CSS-only digit spin, respects prefers-reduced-motion by default: digits
 * then swap instantly). Zero-padded to `digits`.
 *
 * `aria-label` exposes the whole ticket as one string; NumberFlow's own
 * live-region is disabled so the board does not chatter on every tick.
 */
interface TicketNumberProps {
  value: number;
  prefix?: string;
  digits?: number;
  className?: string;
  /** Roll duration in ms (default 700, ~a real flip-board). */
  duration?: number;
}

export const TicketNumber: React.FC<TicketNumberProps> = ({
  value,
  prefix = 'A-',
  digits = 3,
  className,
  duration = 700,
}) => {
  const label = `${prefix}${String(value).padStart(digits, '0')}`;
  return (
    <span aria-label={label} className={cn('inline-flex items-baseline tabular-nums', className)}>
      <span aria-hidden="true">{prefix}</span>
      <NumberFlow
        aria-hidden="true"
        value={value}
        format={{ minimumIntegerDigits: digits, useGrouping: false }}
        transformTiming={{ duration, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        spinTiming={{ duration, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        opacityTiming={{ duration: duration * 0.5, easing: 'ease-out' }}
        willChange
      />
    </span>
  );
};

export default TicketNumber;
