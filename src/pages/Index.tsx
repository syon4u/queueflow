
import React, { useState } from 'react';
import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import CTASection from '@/components/landing/CTASection';
import EmployeeAccessSection from '@/components/landing/EmployeeAccessSection';
import Footer from '@/components/landing/Footer';

const Index: React.FC = () => {
  const [showStaffAccess, setShowStaffAccess] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        showStaffAccess={showStaffAccess}
        onToggleStaffAccess={() => setShowStaffAccess(!showStaffAccess)}
      />
      
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <SocialProofSection />
      <CTASection />
      
      <EmployeeAccessSection 
        showStaffAccess={showStaffAccess}
        onToggleStaffAccess={() => setShowStaffAccess(false)}
      />
      
      <Footer onShowStaffAccess={() => setShowStaffAccess(true)} />
    </div>
  );
};

export default Index;
