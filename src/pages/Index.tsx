
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/landing/HeroSection';
import CustomerServiceCards from '@/components/landing/CustomerServiceCards';
import WelcomeGuideModal from '@/components/landing/WelcomeGuideModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
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
        {/* Language Switcher */}
        <div className="absolute top-4 left-4 z-20">
          <LanguageSwitcher />
        </div>
        
        {/* Hero Section with Background Image */}
        <div className="relative">
          <HeroSection onShowGuide={handleShowGuide} />
        </div>
        
        {/* Customer-Focused Cards */}
        <CustomerServiceCards />
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
