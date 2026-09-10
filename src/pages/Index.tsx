import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import FitStrip from '@/components/landing/FitStrip';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CapabilitiesBento from '@/components/landing/CapabilitiesBento';
import TrustStrip from '@/components/landing/TrustStrip';
import ServiceCardsGrid from '@/components/landing/ServiceCardsGrid';
import PricingTeaser from '@/components/landing/PricingTeaser';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import { useReveal } from '@/components/landing/useReveal';
import { MotionProvider } from '@/components/landing/fx';
import '@/styles/landing.css';

/**
 * Below-the-fold sections mount over the frames after the hero has painted
 * (stage 1, then 2), so the first commit — the one that gates first paint
 * and LCP — only lays out the nav and the hero. Everything is mounted within
 * ~2 frames; the sections are hidden by the scroll reveal until they enter
 * the viewport anyway. A `/#section` deep link renders the whole page at
 * once so the target exists when the hash effect scrolls to it.
 */
const STAGES = 2;
function useProgressiveMount(immediate: boolean) {
  const [stage, setStage] = useState(immediate ? STAGES : 0);
  useEffect(() => {
    if (stage >= STAGES) return;
    const frame = requestAnimationFrame(() => setStage((current) => current + 1));
    return () => cancelAnimationFrame(frame);
  }, [stage]);
  return stage;
}

/**
 * Public landing page. Buyer-facing sections (hero, fit, how it works,
 * capabilities, trust, pricing, CTA) frame one customer-facing block
 * (quick actions) so the two audiences never share a call to action.
 * The `.landing` class scopes the page's own design tokens and type;
 * `MotionProvider` loads Motion's features once for every `m.*` element.
 */
const Index: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();
  const stage = useProgressiveMount(hash !== '');
  useReveal(root, stage);

  // Arriving from another route (e.g. /privacy) via a "/#section" link:
  // the browser only scrolls to hashes on full loads, so do it here.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hash]);

  return (
    <MotionProvider>
      <div ref={root} className="landing min-h-screen w-full">
        <LandingNav />
        <main>
          <HeroSection />
          {stage >= 1 && (
            <>
              <FitStrip />
              <HowItWorksSection />
              <CapabilitiesBento />
            </>
          )}
          {stage >= 2 && (
            <>
              <TrustStrip />
              <ServiceCardsGrid />
              <PricingTeaser />
              <CTASection />
            </>
          )}
        </main>
        {stage >= 2 && <LandingFooter />}
      </div>
    </MotionProvider>
  );
};

export default Index;
