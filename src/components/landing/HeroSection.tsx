
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            {t('landing.heroTitle1', 'Skip the Line,')}
            <span className="block text-blue-600">{t('landing.heroTitle2', 'Not Your Day.')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('landing.heroSubtitle', 'Book, track, and check in from any device. Queue management that actually works.')}
          </p>
          
          {/* Trust Badge */}
          <div className="flex items-center justify-center text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="mr-4">{t('landing.appointmentsProcessed', '2.4M appointments processed')}</span>
            <Shield className="h-4 w-4 text-green-500 mr-1" />
            <span>{t('landing.hipaaCompliant', 'HIPAA Compliant')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
