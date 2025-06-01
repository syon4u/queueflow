
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Calendar, Clock } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

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
    <PageLayout 
      headerTitle="Consumer Protection Division"
      headerSubtitle="Protecting Broward County residents through education, mediation, and enforcement"
    >
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section with background pattern and enhanced typography */}
        <div className="bg-pattern-waves bg-gradient-overlay-blue text-center py-10 md:py-16 lg:py-20 max-w-4xl mx-auto rounded-xl">
          <div className="px-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Simple Queue Management for Your Business
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline customer flow, reduce wait times, and improve the overall experience 
              with our intuitive queue management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/staff')}
                className="font-medium shadow-sm hover:shadow transition-all"
                aria-label="Get Started with QueueFlow"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleShowGuide}
                className="font-medium hover:bg-primary/10 transition-all"
                aria-label="Learn more about QueueFlow"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Portal Cards with improved layout, hover effects and background patterns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 md:py-12 container mx-auto px-4">
          <div 
            className="group bg-pattern-dots bg-gradient-overlay-blue p-6 rounded-xl shadow-sm hover:shadow-md border border-border/40 transition-all cursor-pointer flex flex-col"
            onClick={() => handleCardClick('/staff')}
            role="button"
            tabIndex={0}
            aria-label="Staff Portal"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick('/staff');
              }
            }}
          >
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Staff Portal</h3>
            <p className="text-gray-600 flex-grow">
              Manage customer queues, track wait times, and serve customers efficiently.
            </p>
            <div className="mt-4 text-primary text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Open portal <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </div>
          
          <div 
            className="group bg-pattern-circuit bg-gradient-overlay-teal p-6 rounded-xl shadow-sm hover:shadow-md border border-border/40 transition-all cursor-pointer flex flex-col"
            onClick={() => handleCardClick('/customer')}
            role="button"
            tabIndex={0}
            aria-label="Customer Portal"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick('/customer');
              }
            }}
          >
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Portal</h3>
            <p className="text-gray-600 flex-grow">
              Schedule appointments, check in, and monitor your position in the queue.
            </p>
            <div className="mt-4 text-primary text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Open portal <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </div>
          
          <div 
            className="group bg-pattern-bubbles bg-gradient-overlay-blue p-6 rounded-xl shadow-sm hover:shadow-md border border-border/40 transition-all cursor-pointer flex flex-col"
            onClick={() => handleCardClick('/appointments')}
            role="button"
            tabIndex={0}
            aria-label="Appointments"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick('/appointments');
              }
            }}
          >
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Appointments</h3>
            <p className="text-gray-600 flex-grow">
              View and manage all upcoming appointments and customer bookings.
            </p>
            <div className="mt-4 text-primary text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Open portal <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </div>
        
        {/* About Section with improved layout, visual design and background image */}
        <div className="py-10 md:py-16 max-w-4xl mx-auto container px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">About QueueFlow</h2>
          <div className="bg-image bg-image-overlay rounded-xl shadow-sm border border-border/40" 
               style={{ backgroundImage: "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')" }}>
            <div className="p-6 md:p-8">
              <p className="text-gray-600 mb-4">
                QueueFlow is a modern queue management system designed to help businesses manage customer flow efficiently. 
                Our platform helps reduce wait times, improve customer satisfaction, and optimize staff productivity.
              </p>
              <p className="text-gray-600 mb-4">
                With features like real-time queue updates, appointment scheduling, and analytics, 
                QueueFlow provides everything you need to create a smooth customer experience.
              </p>
              <p className="text-gray-600">
                Whether you're a small business or a large enterprise, QueueFlow scales to meet your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Welcome guide modal with improved accessibility */}
      {showGuide && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowGuide(false)}
        >
          <div 
            className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="guide-title"
            aria-modal="true"
          >
            <h3 id="guide-title" className="text-xl font-bold mb-2">Welcome to QueueFlow</h3>
            <p className="mb-4 text-gray-600">A simple guide to get you started with our queue management system.</p>
            <Button 
              onClick={() => setShowGuide(false)} 
              className="w-full font-medium"
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Index;
