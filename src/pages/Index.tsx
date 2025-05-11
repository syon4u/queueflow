
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Calendar, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">QueueFlow</h1>
          </div>
          <div>
            {user ? (
              <Button onClick={() => navigate('/staff')} variant="outline">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 md:py-20 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Simple Queue Management for Your Business
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline customer flow, reduce wait times, and improve the overall experience 
            with our intuitive queue management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/staff')}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleShowGuide}>
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          <div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick('/staff')}
          >
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Staff Portal</h3>
            <p className="text-gray-600">
              Manage customer queues, track wait times, and serve customers efficiently.
            </p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick('/customer')}
          >
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Portal</h3>
            <p className="text-gray-600">
              Schedule appointments, check in, and monitor your position in the queue.
            </p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick('/appointments')}
          >
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Appointments</h3>
            <p className="text-gray-600">
              View and manage all upcoming appointments and customer bookings.
            </p>
          </div>
        </div>
        
        {/* About Section */}
        <div className="py-12 md:py-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">About QueueFlow</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">QueueFlow</h2>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} QueueFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Welcome guide - placeholder for now */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Welcome to QueueFlow</h3>
            <p className="mb-4">A simple guide to get you started with our queue management system.</p>
            <Button onClick={() => setShowGuide(false)} className="w-full">
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
