
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Move Faster?</h2>
        <p className="text-xl text-blue-100 mb-8">Give your customers a queue they can wait in from anywhere</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8" asChild>
            <Link to="/customer">
              Book Appointment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Link 
            to="/status"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white text-white hover:bg-white hover:text-blue-600 hover:translate-y-[-1px] h-11 px-8 w-full sm:w-auto"
          >
            Check Status
          </Link>
          <Link 
            to="/check-in" 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-700 hover:translate-y-[-1px] h-11 px-8 w-full sm:w-auto text-white"
          >
            Check In Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
