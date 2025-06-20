
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModernHeroSectionProps {
  onShowGuide?: () => void;
}

const ModernHeroSection: React.FC<ModernHeroSectionProps> = ({ onShowGuide }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234F46E5;stop-opacity:1' /%3E%3Cstop offset='30%25' style='stop-color:%237C3AED;stop-opacity:1' /%3E%3Cstop offset='70%25' style='stop-color:%231E40AF;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232563EB;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3Cg opacity='0.1'%3E%3Ccircle cx='300' cy='200' r='60' fill='white' /%3E%3Ccircle cx='600' cy='150' r='40' fill='white' /%3E%3Ccircle cx='900' cy='300' r='50' fill='white' /%3E%3Ccircle cx='1200' cy='180' r='35' fill='white' /%3E%3Ccircle cx='1500' cy='250' r='45' fill='white' /%3E%3Crect x='400' y='500' width='200' height='120' rx='10' fill='white' opacity='0.3' /%3E%3Crect x='800' y='450' width='180' height='100' rx='8' fill='white' opacity='0.25' /%3E%3Crect x='1100' y='520' width='160' height='90' rx='6' fill='white' opacity='0.2' /%3E%3Ctext x='960' y='540' font-family='Inter' font-size='24' fill='white' text-anchor='middle' opacity='0.4'%3EQueue Management%3C/text%3E%3Ctext x='960' y='580' font-family='Inter' font-size='16' fill='white' text-anchor='middle' opacity='0.3'%3ESmart. Efficient. Simple.%3C/text%3E%3C/g%3E%3C/svg%3E"
          onError={(e) => {
            // Hide video on error and show fallback
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.opacity = '1';
          }}
        >
          {/* Using a tech-forward video more aligned with queue management systems */}
          <source src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/6963944/6963944-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Elegant Dark Overlay - Queue management theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        
        {/* Queue-themed Pattern Overlay */}
        <div className="absolute inset-0 opacity-8">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Enhanced Fallback Background with Queue Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 opacity-0 transition-opacity duration-1000"></div>

      {/* Optimized Floating Elements - Reduced for better mobile performance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-purple-300/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-indigo-300/10 rounded-full animate-pulse delay-3000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Smart Queue Management
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              For Modern Business
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Eliminate waiting rooms, reduce customer frustration, and boost efficiency with our AI-powered queue management system.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white border border-white/10">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white border border-white/10">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Smart Scheduling</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white border border-white/10">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">No More Lines</span>
          </div>
        </div>

        {/* Action Buttons with improved touch targets for mobile */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm min-h-[48px] touch-manipulation" 
            asChild
          >
            <Link to="/customer">
              Book Appointment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="w-full sm:w-auto border-2 border-white/80 text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold backdrop-blur-md transition-all duration-300 min-h-[48px] touch-manipulation" 
            asChild
          >
            <Link to="/status">Check Status</Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost"
            className="w-full sm:w-auto text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold backdrop-blur-md transition-all duration-300 min-h-[48px] touch-manipulation" 
            onClick={onShowGuide}
          >
            Learn More
          </Button>
        </div>

        {/* Stats Bar - Enhanced for queue management theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">85%</div>
            <div className="text-blue-100">Time Saved</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">10k+</div>
            <div className="text-blue-100">Happy Customers</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">24/7</div>
            <div className="text-blue-100">Available</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
