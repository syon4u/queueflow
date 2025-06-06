
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Move Faster?</h2>
        <p className="text-xl text-blue-100 mb-8">Join thousands of organizations improving their customer experience</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8" asChild>
            <Link to="/customer">
              Book Appointment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 px-8" asChild>
            <Link to="/status">Check Status</Link>
          </Button>
          <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-blue-700 px-8" asChild>
            <Link to="/check-in">Check In Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
