import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Users, Calendar, Clock } from 'lucide-react';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardButton from '@/components/ui/broward-button';
import BrowardCard from '@/components/ui/broward-card';
import { ShieldCheckmarkAnimation, LandmarkCourthouse, LandmarkBeach, LandmarkPort } from '@/components/ui/broward-icons';

const Index = () => {
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();
  const { user, role } = useAuth();
  
  const handleShowGuide = () => {
    setShowGuide(true);
  };
  
  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <BrowardLayout>
      <BrowardHero 
        title="Broward County Queue Management System" 
        subtitle="Streamline customer flow, reduce wait times, and improve the overall experience"
        backgroundStyle="gradient"
      />
      
      <main className="container mx-auto px-4 py-12">
        {/* Services Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-bc-navy dark:text-bc-blue mb-4">Our Services</h2>
            <p className="max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400">
              Access our queue management services to efficiently handle customer flow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrowardCard 
              className="text-center cursor-pointer"
              onClick={() => handleCardClick('/staff')}
            >
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-bc-blue" />
              </div>
              <h3 className="font-serif text-xl mb-2">Staff Portal</h3>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                Manage customer queues, track wait times, and serve customers efficiently.
              </p>
              <BrowardButton variant="primary">
                Open Portal <ArrowRight className="ml-2 h-4 w-4" />
              </BrowardButton>
            </BrowardCard>
            
            <BrowardCard 
              className="text-center cursor-pointer"
              onClick={() => handleCardClick('/customer')}
            >
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-bc-teal" />
              </div>
              <h3 className="font-serif text-xl mb-2">Customer Portal</h3>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                Schedule appointments, check in, and monitor your position in the queue.
              </p>
              <BrowardButton variant="secondary">
                Open Portal <ArrowRight className="ml-2 h-4 w-4" />
              </BrowardButton>
            </BrowardCard>
            
            <BrowardCard 
              className="text-center cursor-pointer"
              onClick={() => handleCardClick('/appointments')}
            >
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-bc-navy" />
              </div>
              <h3 className="font-serif text-xl mb-2">Appointments</h3>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                View and manage all upcoming appointments and customer bookings.
              </p>
              <BrowardButton variant="outline">
                Open Portal <ArrowRight className="ml-2 h-4 w-4" />
              </BrowardButton>
            </BrowardCard>
          </div>
        </section>
        
        {/* About Section with Landmarks */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-3xl text-bc-navy dark:text-bc-blue mb-4">About QueueFlow</h2>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                QueueFlow is a modern queue management system designed to help businesses manage customer flow efficiently. 
                Our platform helps reduce wait times, improve customer satisfaction, and optimize staff productivity.
              </p>
              <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                With features like real-time queue updates, appointment scheduling, and analytics, 
                QueueFlow provides everything you need to create a smooth customer experience.
              </p>
              <BrowardButton variant="primary" onClick={handleShowGuide}>Learn More</BrowardButton>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex justify-center">
                <LandmarkCourthouse />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex justify-center">
                  <LandmarkBeach />
                </div>
                <div className="flex justify-center">
                  <LandmarkPort />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action with Wave Background */}
        <section className="mb-16">
          <div className="wave-animation bg-gradient-to-r from-bc-navy to-bc-blue rounded-lg p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl text-white mb-4">Ready to Get Started?</h2>
            <p className="text-bc-sand mb-8 max-w-2xl mx-auto">
              Join QueueFlow today and transform your customer service experience with our 
              powerful queue management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BrowardButton 
                variant="primary" 
                className="bg-bc-gold text-bc-navy hover:bg-bc-sand"
                onClick={() => navigate('/staff')}
              >
                Get Started
              </BrowardButton>
              <BrowardButton 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-bc-navy"
                onClick={handleShowGuide}
              >
                Learn More
              </BrowardButton>
            </div>
          </div>
        </section>
      </main>
      
      {/* Welcome guide modal with improved accessibility */}
      {showGuide && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowGuide(false)}
        >
          <div 
            className="bg-white dark:bg-neutral-100 p-6 rounded-xl max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="guide-title"
            aria-modal="true"
          >
            <h3 id="guide-title" className="text-xl font-serif font-bold mb-2 text-bc-navy dark:text-bc-blue">Welcome to QueueFlow</h3>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">A simple guide to get you started with our queue management system.</p>
            <BrowardButton 
              onClick={() => setShowGuide(false)} 
              className="w-full"
            >
              Got it
            </BrowardButton>
          </div>
        </div>
      )}
    </BrowardLayout>
  );
};

export default Index;