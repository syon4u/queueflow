
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onShowGuide?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShowGuide }) => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-gray-100 py-20 overflow-hidden w-full">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Tech Background with Movement Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="relative w-full h-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&crop=center" 
            alt="Technology circuit board background" 
            className="w-full h-full object-cover animate-slow-pan"
          />
          
          {/* Digital Data Flow Animation Overlay */}
          <div className="absolute inset-0">
            {/* Moving dots representing data flow */}
            <div className="absolute top-1/4 left-0 w-2 h-2 bg-blue-500 rounded-full animate-queue-flow"></div>
            <div className="absolute top-1/3 left-0 w-2 h-2 bg-slate-500 rounded-full animate-queue-flow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-2/5 left-0 w-2 h-2 bg-gray-500 rounded-full animate-queue-flow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-600 rounded-full animate-queue-flow" style={{ animationDelay: '3s' }}></div>
            <div className="absolute top-3/5 left-0 w-2 h-2 bg-slate-600 rounded-full animate-queue-flow" style={{ animationDelay: '4s' }}></div>
            
            {/* Flowing lines representing data streams */}
            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-flow-line"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-flow-line" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-flow-line" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-6 animate-fade-in-up relative font-sans tracking-tight">
            Skip the Line,
            <span className="block text-slate-700">Not Your Day.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up font-sans font-normal leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Book, track, and check in from any device. Queue management that actually works.
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white px-8 font-medium" asChild>
              <Link to="/customer">
                Book Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm hover:shadow-md px-8 font-medium" 
              asChild
            >
              <Link to="/status">Check Status</Link>
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-8 font-medium" 
              asChild
            >
              <Link to="/check-in">I'm Here, Check In</Link>
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center text-sm text-gray-500 animate-fade-in-up font-sans" style={{ animationDelay: '0.6s' }}>
            <Shield className="h-4 w-4 text-slate-600 mr-1" />
            <span>Encrypted &amp; access-controlled</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slow-pan {
          0% { transform: scale(1) translateX(0); }
          50% { transform: scale(1.05) translateX(-10px); }
          100% { transform: scale(1) translateX(0); }
        }
        
        @keyframes queue-flow {
          0% { 
            transform: translateX(-20px); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            transform: translateX(calc(100vw + 20px)); 
            opacity: 0; 
          }
        }
        
        @keyframes flow-line {
          0% { 
            transform: translateX(-100%); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.6; 
          }
          90% { 
            opacity: 0.6; 
          }
          100% { 
            transform: translateX(100%); 
            opacity: 0; 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-slow-pan {
          animation: slow-pan 20s ease-in-out infinite;
        }
        
        .animate-queue-flow {
          animation: queue-flow 8s linear infinite;
        }
        
        .animate-flow-line {
          animation: flow-line 6s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
