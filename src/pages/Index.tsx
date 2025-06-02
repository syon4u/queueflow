
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/landing/HeroSection';
import CustomerServiceCards from '@/components/landing/CustomerServiceCards';
import UserMenu from '@/components/landing/UserMenu';
import WelcomeGuideModal from '@/components/landing/WelcomeGuideModal';

const Index = () => {
  const [showGuide, setShowGuide] = useState(false);
  
  const handleShowGuide = () => {
    setShowGuide(true);
  };

  return (
    <PageLayout 
      headerTitle="Consumer Protection Division"
      headerSubtitle="Protecting Broward County residents through education, mediation, and enforcement"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Background Image */}
        <div className="relative">
          <UserMenu />
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
