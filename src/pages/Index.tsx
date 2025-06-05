
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Settings, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  Bell,
  Smartphone,
  Star,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const [showStaffAccess, setShowStaffAccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Queue Flow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/customer">Book</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/queue">Status</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/kiosk">Check In</Link>
              </Button>
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Button variant="outline" size="sm" onClick={() => setShowStaffAccess(!showStaffAccess)}>
                  Employee Login
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/customer">Book Appointment</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/queue">Check Status</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/kiosk">Check In</Link>
                </Button>
                <Button variant="outline" className="justify-start mt-4" onClick={() => setShowStaffAccess(!showStaffAccess)}>
                  Employee Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Skip the Line,
              <span className="block text-blue-600">Not Your Day.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Book, track, and check in from any device. Queue management that actually works.
            </p>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8" asChild>
                <Link to="/customer">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8" asChild>
                <Link to="/queue">Check Status</Link>
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto text-gray-600 hover:bg-gray-100 px-8" asChild>
                <Link to="/kiosk">I'm Here, Check In</Link>
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="mr-4">2.4M appointments processed</span>
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three simple steps to transform your waiting experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <CardTitle className="text-xl">Book</CardTitle>
                <CardDescription>Choose your service & preferred time</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Select from available slots that work with your schedule</p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-yellow-600">2</span>
                </div>
                <CardTitle className="text-xl">Track</CardTitle>
                <CardDescription>Get real-time SMS & email updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Bell className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Stay informed with live wait times and notifications</p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <CardTitle className="text-xl">Check In</CardTitle>
                <CardDescription>Tap once, skip the reception line</CardDescription>
              </CardHeader>
              <CardContent>
                <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Seamless arrival with contactless check-in</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Queue Flow?</h2>
            <p className="text-xl text-gray-600">Built for modern service delivery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Wait Times</h3>
              <p className="text-gray-600 text-sm">Live updates keep you informed</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Location Support</h3>
              <p className="text-gray-600 text-sm">Manage all your offices seamlessly</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ADA-Friendly</h3>
              <p className="text-gray-600 text-sm">Accessible design for everyone</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your data is protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Organizations Everywhere</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"Queue Flow reduced our wait times by 60% and improved customer satisfaction significantly."</p>
                <p className="text-sm font-medium text-gray-900">— Healthcare Practice Manager</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"Our customers love being able to check in from their car. It's been a game-changer."</p>
                <p className="text-sm font-medium text-gray-900">— Government Services Director</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"Setup was incredibly easy, and our staff adapted to the system within days."</p>
                <p className="text-sm font-medium text-gray-900">— Operations Manager</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Band */}
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
              <Link to="/queue">Check Status</Link>
            </Button>
            <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-blue-700 px-8" asChild>
              <Link to="/kiosk">I'm Here, Check In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Employee Access (Collapsible) */}
      {showStaffAccess && (
        <section className="py-12 bg-gray-100 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Employee Access</h3>
                <p className="text-sm text-gray-600">Restricted access portals for authorized personnel</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowStaffAccess(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <UserCheck className="h-5 w-5" />
                    Staff Portal
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    Manage appointments and serve customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100" asChild>
                    <Link to="/staff">Staff Login</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Shield className="h-5 w-5" />
                    Power User Portal
                  </CardTitle>
                  <CardDescription className="text-purple-700">
                    Advanced management and operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100" asChild>
                    <Link to="/power-user">Power User</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Settings className="h-5 w-5" />
                    Admin Portal
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    System administration and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100" asChild>
                    <Link to="/admin">Admin Access</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">Queue Flow</span>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact Support</a>
              <Button variant="ghost" size="sm" onClick={() => setShowStaffAccess(true)} className="text-white hover:text-blue-400">
                Employee Login
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Queue Flow. All rights reserved. | Broward County Queue Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
