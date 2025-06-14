
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
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-indigo-300/20 rounded-full animate-pulse"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full gap-4 p-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Queue Management
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Reimagined
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Skip the wait, schedule smart, and experience the future of customer service with our intelligent queue system.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Smart Scheduling</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">No More Lines</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300" 
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
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300" 
            asChild
          >
            <Link to="/status">Check Status</Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost"
            className="w-full sm:w-auto text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300" 
            onClick={onShowGuide}
          >
            Learn More
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">85%</div>
            <div className="text-blue-100">Time Saved</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">10k+</div>
            <div className="text-blue-100">Happy Customers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-100">Available</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
