
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, Shield, LogOut, Menu, X, Users, Settings } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const Index = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  
  const handleShowGuide = () => {
    setShowGuide(true);
  };
  
  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <PageLayout 
      headerTitle="Consumer Protection Division"
      headerSubtitle="Protecting Broward County residents through education, mediation, and enforcement"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Background Image */}
        <div className="relative bg-white border-b overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
            }}
          >
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
            
            {/* Additional tech-inspired overlay pattern */}
            <div className="absolute inset-0" style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
              `
            }}></div>
          </div>
          
          {/* Hamburger Menu */}
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-3">
              {user && (
                <div className="bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <span className="text-white/95 font-medium drop-shadow text-sm">
                    {user.email}
                  </span>
                </div>
              )}
              
              <Button
                onClick={toggleMenu}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white font-medium border-white/20 hover:border-white/40 drop-shadow-lg hover:scale-105 transition-all duration-200"
              >
                {showMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border min-w-48 z-30">
                <div className="py-2">
                  <button
                    onClick={() => {
                      handleCardClick('/staff');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Users className="h-4 w-4 text-blue-600" />
                    Staff Portal
                  </button>
                  <button
                    onClick={() => {
                      handleCardClick('/admin');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4 text-amber-600" />
                    Admin Portal
                  </button>
                  {user && (
                    <>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="container mx-auto px-4 py-16 text-center relative z-10">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 text-white drop-shadow-lg mr-4" />
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                  QueueFlow
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg font-medium">
                  Skip the wait, schedule your visit, and get the help you need faster with our smart queue system.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/customer')}
                className="font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Schedule Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleShowGuide}
                className="font-medium bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Customer-Focused Cards */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help You Today?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the consumer protection services you need with our convenient online tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card 
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick('/customer')}
            >
              <CardContent className="p-6">
                <div className="bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Schedule an Appointment</h3>
                <p className="text-gray-600 mb-4">
                  Book your visit in advance and skip the wait. Choose your preferred time and service.
                </p>
                <div className="text-green-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Get started <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick('/customer')}
            >
              <CardContent className="p-6">
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Check Queue Status</h3>
                <p className="text-gray-600 mb-4">
                  See current wait times and check in for walk-in services. Stay informed about your queue position.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Check status <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
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
              <p className="mb-4 text-gray-600">QueueFlow helps you manage your time better by allowing you to schedule appointments in advance or check wait times for walk-in services. No more standing in long lines!</p>
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
