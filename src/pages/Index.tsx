
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/landing/Navigation';
import ModernHeroSection from '@/components/landing/ModernHeroSection';
import ServiceCardsGrid from '@/components/landing/ServiceCardsGrid';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import CTASection from '@/components/landing/CTASection';
import WelcomeGuideModal from '@/components/landing/WelcomeGuideModal';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [showGuide, setShowGuide] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleShowGuide = () => {
    setShowGuide(true);
  };

  const handleToggleStaffAccess = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <Navigation 
        showStaffAccess={false}
        onToggleStaffAccess={handleToggleStaffAccess}
      />
      
      {/* Main Content */}
      <div className="w-full">
        {/* Modern Hero Section */}
        <ModernHeroSection onShowGuide={handleShowGuide} />
        
        {/* Service Cards Grid */}
        <ServiceCardsGrid />
        
        {/* Features Showcase */}
        <FeaturesShowcase />
        
        {/* Call to Action Section */}
        <CTASection />
      </div>
      
      {/* Welcome guide modal */}
      <WelcomeGuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
      />
    </div>
  );
};

export default Index;
