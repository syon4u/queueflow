
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldIcon, HandshakeIcon, DocumentIcon } from '@/components/ui/broward-icons';

const BrowardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-bc-navy text-white py-8 mt-12 overflow-hidden">
      {/* Background Pattern - Consumer Protection Theme */}
      <div className="absolute inset-0 opacity-10">
        {/* Shield Pattern Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 5l-8 3v7c0 6 8 10 8 10s8-4 8-10V8l-8-3z' stroke='%23F3D54E' stroke-width='1' fill='none'/%3E%3Cpath d='M30 15l-4 1.5v3.5c0 3 4 5 4 5s4-2 4-5v-3.5L30 15z' stroke='%2300859B' stroke-width='0.5' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundRepeat: 'repeat'
        }} />
        
        {/* Scales of Justice Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 10v80M30 30h40M20 40l10-10 10 10M60 40l10-10 10 10M30 40v10h-20v-10M70 40v10h20v-10" 
                  stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Document/Legal Pattern */}
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="20" y="10" width="40" height="60" stroke="currentColor" strokeWidth="2" fill="none"/>
            <line x1="30" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="1"/>
            <line x1="30" y1="35" x2="50" y2="35" stroke="currentColor" strokeWidth="1"/>
            <line x1="30" y1="45" x2="50" y2="45" stroke="currentColor" strokeWidth="1"/>
            <line x1="30" y1="55" x2="50" y2="55" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
      </div>
      
      {/* Gradient Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-bc-navy via-bc-navy/95 to-bc-blue/90"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4 text-bc-gold font-bold">Broward County</h3>
            <p className="text-bc-sand mb-4 font-medium">
              Consumer Protection Division
            </p>
            <p className="text-bc-sand/80 text-sm mb-4">
              Safeguarding consumers through education, mediation, and enforcement
            </p>
            <div className="flex gap-4">
              <ShieldIcon className="text-bc-gold hover:text-white transition-colors" />
              <HandshakeIcon className="text-bc-gold hover:text-white transition-colors" />
              <DocumentIcon className="text-bc-gold hover:text-white transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-4 text-bc-gold font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-bc-sand hover:text-bc-gold transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-bc-sand hover:text-bc-gold transition-colors font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-bc-sand hover:text-bc-gold transition-colors font-medium">
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-bc-sand hover:text-bc-gold transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-4 text-bc-gold font-semibold">Contact Information</h4>
            <address className="not-italic text-bc-sand">
              <p className="font-medium">1 N. University Drive, Suite 100</p>
              <p className="font-medium">Plantation, FL 33324</p>
              <p className="mt-2 font-medium">Phone: <span className="text-bc-gold">(954) 765-4400</span></p>
              <p className="font-medium">Email: <span className="text-bc-gold">consumer@broward.org</span></p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-bc-gold/30 mt-8 pt-6 text-center text-sm text-bc-sand">
          <p className="font-medium">&copy; {currentYear} Broward County Consumer Protection Division. All rights reserved.</p>
          <p className="mt-1 text-bc-sand/70">Protecting and empowering Broward County residents</p>
        </div>
      </div>
    </footer>
  );
};

export default BrowardFooter;
