
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onShowGuide?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShowGuide }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Tech Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop&crop=center" 
          alt="Digital display screens" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up relative">
            Skip the Line,
            <span className="block text-blue-600">Not Your Day.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Book, track, and check in from any device. Queue management that actually works.
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8" asChild>
              <Link to="/customer">
                Book Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 shadow-sm hover:shadow-md px-8" 
              asChild
            >
              <Link to="/status">Check Status</Link>
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-8" 
              asChild
            >
              <Link to="/check-in">I'm Here, Check In</Link>
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Shield className="h-4 w-4 text-green-500 mr-1" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
