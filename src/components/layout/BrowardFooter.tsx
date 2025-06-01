import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldIcon, HandshakeIcon, DocumentIcon } from '@/components/ui/broward-icons';

const BrowardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bc-navy text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Broward County</h3>
            <p className="text-bc-sand mb-4">
              Consumer Protection Division
            </p>
            <div className="flex gap-4">
              <ShieldIcon className="text-bc-gold" />
              <HandshakeIcon className="text-bc-gold" />
              <DocumentIcon className="text-bc-gold" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-bc-sand hover:text-bc-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-bc-sand hover:text-bc-gold transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-bc-sand hover:text-bc-gold transition-colors">
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-bc-sand hover:text-bc-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-4">Contact Information</h4>
            <address className="not-italic text-bc-sand">
              <p>1 N. University Drive, Suite 100</p>
              <p>Plantation, FL 33324</p>
              <p className="mt-2">Phone: (954) 765-4400</p>
              <p>Email: consumer@broward.org</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-bc-blue-60 mt-8 pt-6 text-center text-sm text-bc-sand">
          <p>&copy; {currentYear} Broward County Consumer Protection Division. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default BrowardFooter;