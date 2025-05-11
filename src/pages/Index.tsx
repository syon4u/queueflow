
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowRight,
  Smartphone,
  MessageSquare,
  LayoutDashboard,
  ChartBar,
  CheckCircle,
  Clock,
  Star,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    customers: 0,
    waitTime: 0,
    satisfaction: 0,
    locations: 0
  });

  // Animate stats when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const statsInterval = setInterval(() => {
            setStats(prev => ({
              customers: Math.min(prev.customers + 157, 15000),
              waitTime: Math.min(prev.waitTime + 3, 30),
              satisfaction: Math.min(prev.satisfaction + 1, 98),
              locations: Math.min(prev.locations + 7, 500)
            }));
          }, 50);
          
          return () => clearInterval(statsInterval);
        }
      },
      { threshold: 0.1 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    return () => {
      if (statsElement) observer.unobserve(statsElement);
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    setMobileMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
    }, 3000);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Customer Service Manager",
      company: "TechCorp Inc.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      content: "QueueFlow revolutionized our customer service department. Wait times decreased by 45% and customer satisfaction increased dramatically."
    },
    {
      name: "Michael Rodriguez",
      role: "Operations Director",
      company: "Healthcare Solutions",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      content: "The analytics provided by QueueFlow helped us optimize staffing and improve patient flow throughout our facilities."
    },
    {
      name: "Jennifer Lee",
      role: "Retail Store Manager",
      company: "Fashion Forward",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      content: "Our customers love the mobile check-in feature. The implementation was smooth and the support team was exceptional."
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-muted/10">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/80 border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              QueueFlow
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection(heroRef)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection(howItWorksRef)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection(testimonialsRef)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection(contactRef)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </button>
            
            {user ? (
              <Button 
                onClick={() => navigate('/staff')} 
                variant="outline"
                className="ml-4 transition-all hover:bg-primary/10"
              >
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                className="ml-4 transition-all hover:bg-primary/10"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-6 bg-white border-t border-gray-100 shadow-lg">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection(heroRef)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection(featuresRef)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection(howItWorksRef)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection(testimonialsRef)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection(contactRef)}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Contact
              </button>
              
              {user ? (
                <Button 
                  onClick={() => navigate('/staff')} 
                  className="w-full mt-4"
                >
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full mt-4"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section 
          ref={heroRef} 
          className="relative overflow-hidden py-20 md:py-28 lg:py-32"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-70"></div>
          
          {/* Animated background elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-10 animate-float"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-indigo-400 rounded-full opacity-10 animate-float-delay"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in">
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Revolutionize
                  </span>
                  <br />
                  Your Customer Flow
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-lg animate-fade-in">
                  Eliminate long wait times, enhance customer satisfaction, and optimize your business operations with our intuitive queue management system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => setIsModalOpen(true)}
                    className="font-medium shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all group"
                  >
                    See It In Action
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => scrollToSection(howItWorksRef)}
                    className="font-medium hover:bg-primary/10 transition-all"
                  >
                    Learn How It Works
                  </Button>
                </div>
              </div>
              
              {/* Hero illustration */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <img 
                      src="https://cdn.lovable.dev/images/QueueFlow-hero.png" 
                      alt="QueueFlow platform visualization" 
                      className="relative rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Counter Section */}
        <section id="stats-section" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold mb-2">{stats.customers.toLocaleString()}</span>
                <span className="text-lg opacity-90">Customers Served</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold mb-2">{stats.waitTime}%</span>
                <span className="text-lg opacity-90">Reduced Wait Times</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold mb-2">{stats.satisfaction}%</span>
                <span className="text-lg opacity-90">Satisfaction Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold mb-2">{stats.locations}</span>
                <span className="text-lg opacity-90">Global Locations</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to transform your customer experience and streamline operations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Mobile Ticketing */}
              <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer border-t-4 border-primary">
                <CardContent className="p-6">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Mobile Ticketing</h3>
                  <p className="text-gray-600">
                    Allow customers to join queues remotely via their mobile devices, eliminating physical wait lines.
                  </p>
                  <div className="mt-4 text-primary flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
              
              {/* SMS Alerts */}
              <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer border-t-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="bg-blue-500/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">SMS Alerts</h3>
                  <p className="text-gray-600">
                    Send automated notifications to customers as their turn approaches, giving them freedom to wait anywhere.
                  </p>
                  <div className="mt-4 text-blue-500 flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Real-Time Dashboards */}
              <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer border-t-4 border-indigo-500">
                <CardContent className="p-6">
                  <div className="bg-indigo-500/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                    <LayoutDashboard className="h-6 w-6 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Real-Time Dashboards</h3>
                  <p className="text-gray-600">
                    Monitor queue status, wait times, and staff performance through intuitive real-time analytics dashboards.
                  </p>
                  <div className="mt-4 text-indigo-500 flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Visitor Analytics */}
              <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer border-t-4 border-purple-500">
                <CardContent className="p-6">
                  <div className="bg-purple-500/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                    <ChartBar className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Visitor Analytics</h3>
                  <p className="text-gray-600">
                    Gain valuable insights into customer flow patterns, peak hours, and service efficiency to optimize operations.
                  </p>
                  <div className="mt-4 text-purple-500 flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section ref={howItWorksRef} className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How QueueFlow Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A seamless experience from check-in to service completion
              </p>
            </div>
            
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-primary transform -translate-y-1/2 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="bg-white p-8 rounded-xl shadow-md relative z-10">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-6 mx-auto">1</div>
                  <h3 className="text-xl font-bold text-center mb-4">Customer Check-In</h3>
                  <div className="text-center mb-6">
                    <Smartphone className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                  </div>
                  <p className="text-gray-600 text-center">
                    Customers join the queue through their mobile device, kiosk, or with staff assistance.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="bg-white p-8 rounded-xl shadow-md relative z-10">
                  <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-6 mx-auto">2</div>
                  <h3 className="text-xl font-bold text-center mb-4">Wait Anywhere</h3>
                  <div className="text-center mb-6">
                    <MessageSquare className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
                  </div>
                  <p className="text-gray-600 text-center">
                    SMS notifications keep customers informed of queue progress and estimated wait times.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="bg-white p-8 rounded-xl shadow-md relative z-10">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-6 mx-auto">3</div>
                  <h3 className="text-xl font-bold text-center mb-4">Service & Feedback</h3>
                  <div className="text-center mb-6">
                    <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                  </div>
                  <p className="text-gray-600 text-center">
                    Customers receive service and provide feedback, helping businesses continuously improve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-20 bg-gradient-to-tr from-blue-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Businesses across industries are transforming their customer experience with QueueFlow
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto px-4 lg:px-0">
              <Carousel
                className="w-full"
              >
                <CarouselContent>
                  {testimonials.map((testimonial, i) => (
                    <CarouselItem key={i}>
                      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="shrink-0">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                            />
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                            <p className="text-lg mb-6 italic">"{testimonial.content}"</p>
                            <div>
                              <h4 className="font-bold text-lg">{testimonial.name}</h4>
                              <p className="opacity-80">{testimonial.role}, {testimonial.company}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8">
                  <CarouselPrevious className="static translate-y-0 mr-4" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>
        
        {/* Pricing CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-10 border border-blue-200 shadow-xl">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Customer Experience?</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Get in touch for a personalized quote tailored to your business needs.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection(contactRef)}
                  className="font-medium px-8 shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all"
                >
                  Get a Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section ref={contactRef} className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started with QueueFlow</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Request a demo or learn more about how QueueFlow can help your business
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 border border-gray-100">
                <form onSubmit={handleDemoRequest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                      <Input 
                        id="name" 
                        placeholder="Your name" 
                        required 
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block mb-2 font-medium">Company</label>
                      <Input 
                        id="company" 
                        placeholder="Your company" 
                        required 
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@company.com" 
                      required 
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      placeholder="How can we help you?" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    ></textarea>
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto px-8"
                  >
                    Request Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block">QueueFlow</h2>
              <p className="text-gray-300 mb-4">
                Simple and effective queue management for businesses of all sizes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">Product</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-300 hover:text-white transition-colors">Features</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Solutions</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Pricing</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">Company</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-300 hover:text-white transition-colors">About</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Blog</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Careers</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">Legal</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-300 hover:text-white transition-colors">Privacy</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Terms</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">Security</button></li>
                <li><button className="text-gray-300 hover:text-white transition-colors">GDPR</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            &copy; {new Date().getFullYear()} QueueFlow. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Demo Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-lg max-w-xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <X />
            </button>
            
            {!formSubmitted ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">Request a Demo</h2>
                <form onSubmit={handleDemoRequest} className="space-y-4">
                  <div>
                    <label htmlFor="modal-name" className="block mb-2 font-medium">Name</label>
                    <Input id="modal-name" placeholder="Your name" required />
                  </div>
                  <div>
                    <label htmlFor="modal-email" className="block mb-2 font-medium">Email</label>
                    <Input id="modal-email" type="email" placeholder="your.email@company.com" required />
                  </div>
                  <div>
                    <label htmlFor="modal-company" className="block mb-2 font-medium">Company</label>
                    <Input id="modal-company" placeholder="Your company" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Request
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-700 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Your demo request has been submitted. Our team will contact you shortly.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFormSubmitted(false);
                    setIsModalOpen(false);
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
