import { useEffect, type RefObject } from 'react';

/**
 * Scroll reveal for the landing page. Elements carrying `.reveal` inside
 * `root` fade/slide in when they enter the viewport; siblings that share a
 * parent are staggered 60ms apart via `--reveal-i`.
 *
 * The root only gets `data-reveal="ready"` (which is what hides elements in
 * CSS) once IntersectionObserver is confirmed available and the user has not
 * asked for reduced motion, so without JS, without IO, or with reduced motion
 * everything simply renders visible.
 */
export function useReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>('.reveal'));
    if (targets.length === 0) return;

    // Stagger index: position among `.reveal` siblings of the same parent.
    targets.forEach((target) => {
      const siblings = target.parentElement
        ? Array.from(target.parentElement.children).filter((c) => c.classList.contains('reveal'))
        : [];
      const index = Math.max(0, siblings.indexOf(target));
      target.style.setProperty('--reveal-i', String(Math.min(index, 8)));
    });

    el.dataset.reveal = 'ready';

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // A data attribute, not a class: React never rewrites attributes it
            // does not render, so a later className update cannot hide the element again.
            (entry.target as HTMLElement).dataset.visible = '';
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    targets.forEach((t) => observer.observe(t));

    return () => {
      observer.disconnect();
      delete el.dataset.reveal;
    };
  }, [root]);
}
