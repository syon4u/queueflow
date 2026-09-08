import React from 'react';
import { ShieldCheckmarkAnimation } from '@/components/ui/brand-icons';

interface SiteHeroProps {
  title: string;
  subtitle?: string;
  showAnimation?: boolean;
  backgroundStyle?: 'gradient' | 'pattern' | 'wave';
}

const SiteHero: React.FC<SiteHeroProps> = ({
  title,
  subtitle,
  showAnimation = true,
  backgroundStyle = 'gradient'
}) => {
  let backgroundClass = '';
  
  switch (backgroundStyle) {
    case 'pattern':
      backgroundClass = 'coastal-pattern';
      break;
    case 'wave':
      backgroundClass = 'wave-animation';
      break;
    case 'gradient':
    default:
      backgroundClass = 'bg-gradient-to-r from-bc-navy to-bc-blue';
      break;
  }
  
  return (
    <section className={`hero ${backgroundClass} py-12 px-4 md:py-16`}>
      <div className="hero-content">
        {showAnimation && (
          <ShieldCheckmarkAnimation size={80} className="mb-6" />
        )}
        
        <h1 className="hero-title font-serif text-white text-3xl md:text-4xl lg:text-5xl mb-4">
          {title}
        </h1>
        
        {subtitle && (
          <p className="hero-subtitle text-white text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default SiteHero;