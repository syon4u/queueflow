/**
 * Landing-page motion / texture primitives. Everything here is either MIT
 * (ported from Magic UI, headers kept) or written for QueueFlow. Import from
 * '@/components/landing/fx'. Wrap the landing root in <MotionProvider> once.
 *
 * Bundle notes (gzip): motion `m` + domAnimation ≈ 20 kB shared; NumberFlow
 * ≈ 6 kB; the rest is CSS/SVG/canvas. Lazy-load FlickeringGrid via
 * React.lazy so its canvas loop stays out of the main chunk.
 */
export { MotionProvider } from './MotionProvider';
export { CalledWords } from './CalledWords';
export { TicketNumber } from './TicketNumber';
export { Marquee } from './Marquee';
export { BorderBeam } from './BorderBeam';
export { Grain } from './Grain';
