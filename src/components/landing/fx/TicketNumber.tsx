import React from 'react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';

/**
 * A lobby-board ticket number ("A-042") whose digits roll like a mechanical
 * counter when `value` changes. Built on @number-flow/react (6 kB gzip,
 * CSS-only digit spin, respects prefers-reduced-motion by default: digits
 * then swap instantly). Zero-padded to `digits`.
 *
 * The wrapper is `role="img"` with the whole ticket as its `aria-label`
 * (a plain span may not carry aria-label), and the prefix and NumberFlow
 * digits inside are hidden, so assistive tech reads one string. NumberFlow's
 * own live region stays off so the board does not chatter on every tick;
 * "The Call" is announced by the hero's polite live region instead.
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
    <span role="img" aria-label={label} className={cn('inline-flex items-baseline tabular-nums', className)}>
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
