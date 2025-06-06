
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/landing/HeroSection';
import CustomerServiceCards from '@/components/landing/CustomerServiceCards';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import WelcomeGuideModal from '@/components/landing/WelcomeGuideModal';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [showGuide, setShowGuide] = useState(false);
  const { t } = useTranslation();
  
  const handleShowGuide = () => {
    setShowGuide(true);
  };

  return (
    <PageLayout 
      headerTitle={t('landing.headerTitle')}
      headerSubtitle={t('landing.headerSubtitle')}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection onShowGuide={handleShowGuide} />
        
        {/* Customer-Focused Cards */}
        <CustomerServiceCards />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Stats Section */}
        <StatsSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Call to Action Section */}
        <CTASection />
      </div>
      
      {/* Welcome guide modal */}
      <WelcomeGuideModal 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
      />
    </PageLayout>
  );
};

export default Index;
