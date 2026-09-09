
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldIcon, HandshakeIcon, DocumentIcon } from '@/components/ui/brand-icons';

const SiteFooter: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white py-8 mt-12 overflow-hidden">
      {/* Flowing Background Pattern inspired by the uploaded image */}
      <div className="absolute inset-0">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/80 via-purple-500/80 via-red-400/80 to-orange-400/80"></div>
        
        {/* Flowing wave pattern */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.12) 0%, transparent 50%)
          `
        }}></div>
        
        {/* Consumer protection icons pattern */}
        <div className="absolute inset-0 opacity-10">
          {/* Scattered icons similar to the uploaded image */}
          <div className="absolute top-4 left-10 w-8 h-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="absolute top-12 right-20 w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
              <rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
            </svg>
          </div>
          <div className="absolute bottom-16 left-1/4 w-7 h-7">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div className="absolute top-1/3 right-10 w-5 h-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            </svg>
          </div>
          <div className="absolute bottom-8 right-1/3 w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="M20 8v6M23 11h-6"/>
            </svg>
          </div>
          <div className="absolute top-20 left-1/3 w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4 text-white font-bold drop-shadow-lg">Queue Flow</h3>
            <p className="text-white/95 mb-4 font-medium drop-shadow">
              {t('public.layout.footer.tagline')}
            </p>
            <p className="text-white/90 text-sm mb-4 drop-shadow">
              {t('public.layout.footer.description')}
            </p>
            <div className="flex gap-4">
              <ShieldIcon className="text-white hover:text-white/80 transition-colors drop-shadow" />
              <HandshakeIcon className="text-white hover:text-white/80 transition-colors drop-shadow" />
              <DocumentIcon className="text-white hover:text-white/80 transition-colors drop-shadow" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-4 text-white font-semibold drop-shadow-lg">{t('public.layout.footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/95 hover:text-white transition-colors font-medium drop-shadow hover:drop-shadow-lg">
                  {t('public.layout.footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/95 hover:text-white transition-colors font-medium drop-shadow hover:drop-shadow-lg">
                  {t('public.layout.footer.services')}
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-white/95 hover:text-white transition-colors font-medium drop-shadow hover:drop-shadow-lg">
                  {t('public.layout.footer.appointments')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/95 hover:text-white transition-colors font-medium drop-shadow hover:drop-shadow-lg">
                  {t('public.layout.footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-4 text-white font-semibold drop-shadow-lg">{t('public.layout.footer.contactInfo')}</h4>
            <address className="not-italic text-white/95">
              
              <p className="font-medium drop-shadow">{t('public.layout.footer.email')} <span className="text-white font-bold">info@garrickinternational.com</span></p>
              <p className="mt-2 font-medium drop-shadow">{t('public.layout.footer.supportHours')}</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-white/30 mt-8 pt-6 text-center text-sm text-white/95">
          <p className="font-medium drop-shadow">{t('public.layout.footer.rights', { year: currentYear })}</p>
          <p className="mt-1 text-white/90 drop-shadow">{t('public.layout.footer.motto')}</p>
          <nav aria-label={t('public.legal.navLabel')} className="mt-3">
            <ul className="flex flex-wrap justify-center gap-x-5">
              {(['privacy', 'terms', 'accessibility'] as const).map((key) => (
                <li key={key}>
                  <Link
                    to={`/${key}`}
                    className="inline-flex min-h-11 items-center text-white/95 underline underline-offset-4 transition-colors hover:text-white font-medium drop-shadow"
                  >
                    {t(`public.legal.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
