import React, { useEffect, useRef } from 'react';
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
 * Public landing page. Buyer-facing sections (hero, fit, how it works,
 * capabilities, trust, pricing, CTA) frame one customer-facing block
 * (quick actions) so the two audiences never share a call to action.
 * The `.landing` class scopes the page's own design tokens and type;
 * `MotionProvider` loads Motion's features once for every `m.*` element.
 */
const Index: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();
  useReveal(root);

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
          <FitStrip />
          <HowItWorksSection />
          <CapabilitiesBento />
          <TrustStrip />
          <ServiceCardsGrid />
          <PricingTeaser />
          <CTASection />
        </main>
        <LandingFooter />
      </div>
    </MotionProvider>
  );
};

export default Index;
