
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Never Wait In Line Again
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              QueueFlow transforms the way organizations manage appointments and queues, providing a seamless experience for both customers and staff.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link to="/customer">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link to="/status">Check Status</Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute -left-8 -top-8 w-64 h-64 bg-white/10 rounded-full filter blur-xl"></div>
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-yellow-500/30 rounded-full filter blur-xl"></div>
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="font-medium">Queue Management Demo</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-white font-medium">Your turn is coming up!</p>
                  </div>
                  <div className="bg-white/90 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 font-medium">Current wait time:</span>
                      <span className="text-blue-700 font-bold">~12 min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
