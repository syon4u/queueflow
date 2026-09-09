import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * "The Call" — the one heartbeat behind the hero. `head` is how many tickets
 * have been called since the page loaded; the LED board, the staff-dashboard
 * mock and the customer's phone ticket all derive from it, so every surface
 * advances together.
 *
 * Timeline (see docs/landing-art-direction.md §5): digits render at A-041,
 * the first call lands at 900 ms (A-042), then one every 4 s. Pressing the
 * mock's "Call next" calls immediately and restarts the 4 s clock, so a
 * manual call is never followed by a second roll a few hundred ms later.
 *
 * Under prefers-reduced-motion the clock never starts and the page opens on
 * the settled state (A-042, "#2 in line"); "Call next" still advances the
 * example, with NumberFlow swapping digits instantly.
 *
 * `announcedHead` only changes on user-triggered calls, so the polite live
 * region in the hero speaks for a press and stays quiet for the interval.
 */
export const FIRST_TICKET = 42;
export const COUNTER = 3;
export const ADVANCE_MS = 4000;
export const FIRST_CALL_MS = 900;
const WRAP = 900; // keep the number three digits

export const ticketLabel = (n: number) => `A-${String(n).padStart(3, '0')}`;

/** Ticket now being served for a given heartbeat. */
export const servingTicket = (head: number) => FIRST_TICKET + head;

/**
 * The customer's phone ticket walks down the line 3 → 2 → 1, then a fresh
 * ticket is issued three places back, so the loop never shows a served ticket.
 */
export const phonePosition = (head: number) => 3 - (((head + 1) % 3) + 3) % 3;
export const phoneTicket = (head: number) => servingTicket(head) + phonePosition(head);

export function useCallHeartbeat() {
  const reduced = !!useReducedMotion();
  const [head, setHead] = useState(() => (reduced ? 0 : -1));
  const [announcedHead, setAnnouncedHead] = useState<number | null>(null);
  const headRef = useRef(head);
  headRef.current = head;
  const interval = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (interval.current !== null) window.clearInterval(interval.current);
    interval.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    interval.current = window.setInterval(() => setHead((h) => (h + 1) % WRAP), ADVANCE_MS);
  }, [stop]);

  useEffect(() => {
    if (reduced) return;
    const first = window.setTimeout(() => {
      setHead((h) => (h + 1) % WRAP);
      start();
    }, FIRST_CALL_MS);
    return () => {
      window.clearTimeout(first);
      stop();
    };
  }, [reduced, start, stop]);

  const callNext = useCallback(() => {
    const next = (headRef.current + 1) % WRAP;
    setHead(next);
    setAnnouncedHead(next);
    if (!reduced) start();
  }, [reduced, start]);

  return { head, callNext, announcedHead, reduced } as const;
}
