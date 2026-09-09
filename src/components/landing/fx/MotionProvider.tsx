import React from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';

/**
 * Wrap the landing page root in this once. It loads Motion's `domAnimation`
 * feature set (~15 kB gzip) so every `m.*` element in `fx/` can animate,
 * and `reducedMotion="user"` makes Motion honour prefers-reduced-motion by
 * turning transform/layout animations into instant changes (opacity still
 * fades). Components here import `m` from `motion/react-m`, never `motion`
 * from `motion/react`, so the full 34 kB runtime is never pulled in.
 *
 * `strict` throws in dev if a `motion.*` element sneaks in, which keeps the
 * bundle honest.
 */
export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </LazyMotion>
);

export default MotionProvider;
