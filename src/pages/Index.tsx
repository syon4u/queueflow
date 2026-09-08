import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/landing/Navigation';
import ModernHeroSection from '@/components/landing/ModernHeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ServiceCardsGrid from '@/components/landing/ServiceCardsGrid';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import TrustStrip from '@/components/landing/TrustStrip';
import PricingTeaser from '@/components/landing/PricingTeaser';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

/**
 * Public landing page. Buyer-facing sections (hero, how it works,
 * capabilities, trust, pricing, CTA) frame one customer-facing block
 * (quick actions) so the two audiences never share a call to action.
 */
const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white">
      <Navigation showStaffAccess={false} onToggleStaffAccess={() => navigate('/login')} />
      <main>
        <ModernHeroSection />
        <HowItWorksSection />
        <ServiceCardsGrid />
        <FeaturesShowcase />
        <TrustStrip />
        <PricingTeaser />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
