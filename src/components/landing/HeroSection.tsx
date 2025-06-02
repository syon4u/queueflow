
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';

interface HeroSectionProps {
  onShowGuide: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShowGuide }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative bg-white border-b overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      >
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
        
        {/* Additional tech-inspired overlay pattern */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
          `
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 text-center relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Shield className="h-16 w-16 text-white drop-shadow-lg mr-4" />
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg font-medium">
              {t('landing.hero.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            size="lg" 
            onClick={() => navigate('/customer')}
            className="font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('landing.hero.scheduleButton')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={onShowGuide}
            className="font-medium bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('landing.hero.learnMoreButton')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
