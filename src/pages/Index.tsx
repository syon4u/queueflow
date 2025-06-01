
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Calendar, Clock, Shield } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 text-bc-blue mr-4" />
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                  QueueFlow
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Streamline customer flow, reduce wait times, and improve the overall experience 
                  with our intuitive queue management system.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/staff')}
                className="font-medium"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleShowGuide}
                className="font-medium"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Portal Cards */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card 
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick('/staff')}
            >
              <CardContent className="p-6">
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Staff Portal</h3>
                <p className="text-gray-600 mb-4">
                  Manage customer queues, track wait times, and serve customers efficiently.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Open portal <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick('/customer')}
            >
              <CardContent className="p-6">
                <div className="bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Portal</h3>
                <p className="text-gray-600 mb-4">
                  Schedule appointments, check in, and monitor your position in the queue.
                </p>
                <div className="text-green-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Open portal <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick('/appointments')}
            >
              <CardContent className="p-6">
                <div className="bg-amber-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Appointments</h3>
                <p className="text-gray-600 mb-4">
                  View and manage all upcoming appointments and customer bookings.
                </p>
                <div className="text-amber-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Open portal <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* About Section */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">About QueueFlow</h2>
              <div className="text-left space-y-4 text-gray-600">
                <p>
                  QueueFlow is a modern queue management system designed to help businesses manage customer flow efficiently. 
                  Our platform helps reduce wait times, improve customer satisfaction, and optimize staff productivity.
                </p>
                <p>
                  With features like real-time queue updates, appointment scheduling, and analytics, 
                  QueueFlow provides everything you need to create a smooth customer experience.
                </p>
                <p>
                  Whether you're a small business or a large enterprise, QueueFlow scales to meet your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Welcome guide modal */}
      {showGuide && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowGuide(false)}
        >
          <Card 
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Welcome to QueueFlow</h3>
              <p className="mb-4 text-gray-600">A simple guide to get you started with our queue management system.</p>
              <Button 
                onClick={() => setShowGuide(false)} 
                className="w-full"
              >
                Got it
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
};

export default Index;
